import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSession } from "./session";
import { prisma } from "./db";
import { hasPremium, trialEnd } from "./premium-plan";
export { hasPremium } from "./premium-plan";
function status(user: NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>) {
  return {
    premium: hasPremium(user),
    subscription: user.subscription,
    premiumEndsAt: user.premiumEndsAt?.toISOString() || null,
    trialStartedAt: user.trialStartedAt?.toISOString() || null,
    trialEndsAt: trialEnd(user)?.toISOString() || null,
  };
}
export const subscriptionStatus = createServerFn({ method: "GET" }).handler(async () => {
  const id = requireSession(getRequest());
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });
  return status(user);
});
export const startTrial = createServerFn({ method: "POST" }).handler(async () => {
  const id = requireSession(getRequest());
  await prisma.user.updateMany({
    where: { id, trialStartedAt: null, subscription: "FREE", isEmailVerified: true },
    data: { trialStartedAt: new Date() },
  });
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });
  if (!user.isEmailVerified) throw new Error("Vui lòng xác thực email để dùng thử.");
  return status(user);
});
