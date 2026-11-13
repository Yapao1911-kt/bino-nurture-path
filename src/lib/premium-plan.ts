export const PREMIUM_PLAN = { name: "Bino Premium", amount: 180000, days: 30 } as const;
export const PAYMENT_ACCOUNT = {
  bank: "BIDV",
  bin: "970418",
  number: "7500908855",
  name: "TRAN GIA BAO",
} as const;
export const ORDER_LABELS: Record<string, string> = {
  PENDING: "Chờ chuyển khoản",
  AWAITING_REVIEW: "Chờ đối soát",
  PAID: "Đã kích hoạt",
  REJECTED: "Cần kiểm tra lại",
  CANCELLED: "Đã hủy",
  EXPIRED: "Hết hạn chuyển khoản",
};
export type Membership = {
  subscription: string;
  trialStartedAt: Date | null;
  premiumEndsAt?: Date | null;
};
export function trialEnd(user: Membership) {
  return user.trialStartedAt ? new Date(user.trialStartedAt.getTime() + 14 * 86400000) : null;
}
export function hasPremium(user: Membership | null, now = Date.now()) {
  return (
    !!user &&
    ((user.subscription === "PREMIUM" &&
      (!user.premiumEndsAt || user.premiumEndsAt.getTime() > now)) ||
      (!!user.trialStartedAt &&
        user.trialStartedAt.getTime() <= now &&
        trialEnd(user)!.getTime() > now))
  );
}
export function renewalEnd(user: Membership, now = Date.now(), days: number = PREMIUM_PLAN.days) {
  return new Date(
    Math.max(now, user.premiumEndsAt?.getTime() || 0, trialEnd(user)?.getTime() || 0) +
      days * 86400000,
  );
}
export function paymentQr(code: string, amount: number) {
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo: code,
    accountName: PAYMENT_ACCOUNT.name,
  });
  return `https://img.vietqr.io/image/${PAYMENT_ACCOUNT.bin}-${PAYMENT_ACCOUNT.number}-compact2.png?${params}`;
}
