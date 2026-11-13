import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { prisma } from "./db";
import { requireSession } from "./session";
export const appointmentQueue = createServerFn({ method: "GET" }).handler(async () => {
  await (await import("./operator.server")).requireOperator();
  return prisma.appointment.findMany({
    where: { status: "PENDING" },
    include: { child: { select: { name: true, user: { select: { email: true } } } } },
    orderBy: { createdAt: "asc" },
    take: 100,
  });
});
export const confirmAppointment = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await (await import("./operator.server")).requireOperator();
    return prisma.appointment.updateMany({
      where: { id: data.id, status: "PENDING" },
      data: { status: "CONFIRMED" },
    });
  });
