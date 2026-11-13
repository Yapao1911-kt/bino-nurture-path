import { randomBytes } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { prisma } from "./db";
import { requireSession } from "./session";

import { PREMIUM_PLAN, renewalEnd } from "./premium-plan";
const orderInput = z.object({ id: z.string().min(1).max(100) });
export const myPremiumOrders = createServerFn({ method: "GET" }).handler(async () => {
  const userId = requireSession(getRequest());
  await prisma.premiumOrder.updateMany({
    where: { userId, status: "PENDING", expiresAt: { lte: new Date() } },
    data: { status: "EXPIRED" },
  });
  return prisma.premiumOrder.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
});
export const createPremiumOrder = createServerFn({ method: "POST" }).handler(async () => {
  const userId = requireSession(getRequest());
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${userId} FOR UPDATE`;
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.isEmailVerified) throw new Error("Vui lòng xác thực email trước khi tạo đơn.");
    if (user.subscription === "PREMIUM" && !user.premiumEndsAt)
      throw new Error("Tài khoản đã có Premium không thời hạn.");
    const now = new Date();
    await tx.premiumOrder.updateMany({
      where: { userId, status: "PENDING", expiresAt: { lte: now } },
      data: { status: "EXPIRED" },
    });
    const existing = await tx.premiumOrder.findFirst({
      where: { userId, status: { in: ["PENDING", "AWAITING_REVIEW"] } },
    });
    if (existing) return existing;
    return tx.premiumOrder.create({
      data: {
        userId,
        code: "BINO" + randomBytes(8).toString("hex").toUpperCase(),
        amount: PREMIUM_PLAN.amount,
        days: PREMIUM_PLAN.days,
        expiresAt: new Date(now.getTime() + 86400000),
      },
    });
  });
});
export const submitPremiumPayment = createServerFn({ method: "POST" })
  .validator((data: unknown) => orderInput.parse(data))
  .handler(async ({ data }) => {
    const userId = requireSession(getRequest());
    await prisma.premiumOrder.updateMany({
      where: { id: data.id, userId, status: "PENDING", expiresAt: { gt: new Date() } },
      data: { status: "AWAITING_REVIEW", submittedAt: new Date() },
    });
    const order = await prisma.premiumOrder.findFirst({ where: { id: data.id, userId } });
    if (!order || !["AWAITING_REVIEW", "PAID"].includes(order.status))
      throw new Error("Đơn không còn nhận báo chuyển khoản. Vui lòng làm mới trang.");
    return order;
  });
export const cancelPremiumOrder = createServerFn({ method: "POST" })
  .validator((data: unknown) => orderInput.parse(data))
  .handler(async ({ data }) => {
    const userId = requireSession(getRequest());
    const result = await prisma.premiumOrder.updateMany({
      where: { id: data.id, userId, status: "PENDING" },
      data: { status: "CANCELLED" },
    });
    if (!result.count) throw new Error("Chỉ có thể hủy đơn chưa báo chuyển khoản.");
  });
export const premiumOrderQueue = createServerFn({ method: "GET" }).handler(async () => {
  await (await import("./operator.server")).requireOperator();
  return prisma.premiumOrder.findMany({
    where: { status: { in: ["AWAITING_REVIEW", "PAID", "REJECTED"] } },
    include: { user: { select: { email: true, name: true } } },
    orderBy: { submittedAt: "desc" },
    take: 100,
  });
});
export const reviewPremiumOrder = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        id: z.string().min(1).max(100),
        approve: z.boolean(),
        bankReference: z.string().trim().max(100),
        note: z.string().trim().max(500),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const operator = await (await import("./operator.server")).requireOperator();
    if (data.approve && data.bankReference.length < 4)
      throw new Error("Nhập mã giao dịch ngân hàng để đối soát.");
    if (!data.approve && !data.note) throw new Error("Nhập lý do chưa xác nhận để phụ huynh biết.");
    return prisma.$transaction(async (tx) => {
      const order = await tx.premiumOrder.findUniqueOrThrow({ where: { id: data.id } });
      await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${order.userId} FOR UPDATE`;
      const current = await tx.premiumOrder.findUniqueOrThrow({ where: { id: data.id } });
      if (current.status !== "AWAITING_REVIEW")
        throw new Error("Đơn đã được xử lý. Vui lòng làm mới danh sách.");
      const user = await tx.user.findUniqueOrThrow({ where: { id: order.userId } });
      const grantedUntil = data.approve ? renewalEnd(user, Date.now(), order.days) : null;
      if (data.approve) {
        const duplicate = await tx.premiumOrder.findUnique({
          where: { bankReference: data.bankReference },
        });
        if (duplicate) throw new Error("Mã giao dịch đã được sử dụng cho đơn khác.");
        await tx.user.update({
          where: { id: user.id },
          data: {
            subscription: "PREMIUM",
            premiumEndsAt:
              user.subscription === "PREMIUM" && !user.premiumEndsAt ? null : grantedUntil,
          },
        });
      }
      return tx.premiumOrder.update({
        where: { id: order.id },
        data: {
          status: data.approve ? "PAID" : "REJECTED",
          bankReference: data.approve ? data.bankReference : null,
          reviewNote: data.note || null,
          reviewedAt: new Date(),
          reviewedBy: operator.email,
          grantedUntil,
        },
      });
    });
  });
