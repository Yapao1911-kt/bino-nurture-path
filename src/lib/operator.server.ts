import { requireSession } from "./session";
import { getRequest } from "@tanstack/react-start/server";
import { prisma } from "./db";
export async function requireOperator() {
  const id = requireSession(getRequest());
  const user = await prisma.user.findUnique({ where: { id } });
  if (
    !process.env.BINO_OPERATOR_EMAIL ||
    !user?.isEmailVerified ||
    user.email !== process.env.BINO_OPERATOR_EMAIL.toLowerCase().trim()
  )
    throw new Error("Không có quyền vận hành.");
  return user;
}
