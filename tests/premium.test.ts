import { test } from "node:test";
import assert from "node:assert/strict";
import { hasPremium, renewalEnd, paymentQr } from "../src/lib/premium-plan";
const now = Date.UTC(2026, 10, 13);
const day = 86400000;
test("paid entitlement expires exactly at boundary; trial never restarts it", () => {
  assert.equal(
    hasPremium(
      { subscription: "PREMIUM", trialStartedAt: null, premiumEndsAt: new Date(now) },
      now,
    ),
    false,
  );
  assert.equal(
    hasPremium(
      { subscription: "PREMIUM", trialStartedAt: null, premiumEndsAt: new Date(now + 1) },
      now,
    ),
    true,
  );
  assert.equal(
    hasPremium({ subscription: "FREE", trialStartedAt: new Date(now - 14 * day) }, now),
    false,
  );
  assert.equal(
    hasPremium({ subscription: "FREE", trialStartedAt: new Date(now + day) }, now),
    false,
  );
  assert.equal(hasPremium({ subscription: "PREMIUM", trialStartedAt: null }, now), true);
});
test("renewal preserves paid and trial time and starts expired plans from now", () => {
  assert.equal(
    renewalEnd(
      { subscription: "PREMIUM", trialStartedAt: null, premiumEndsAt: new Date(now + 5 * day) },
      now,
    ).getTime(),
    now + 35 * day,
  );
  assert.equal(
    renewalEnd({ subscription: "FREE", trialStartedAt: new Date(now - 4 * day) }, now).getTime(),
    now + 40 * day,
  );
  assert.equal(
    renewalEnd(
      { subscription: "PREMIUM", trialStartedAt: null, premiumEndsAt: new Date(now - day) },
      now,
    ).getTime(),
    now + 30 * day,
  );
});
test("QR contains correct receiving bank, account, order and server amount", () => {
  const url = new URL(paymentQr("BINO123456", 180000));
  assert.equal(url.pathname, "/image/970418-7500908855-compact2.png");
  assert.equal(url.searchParams.get("amount"), "180000");
  assert.equal(url.searchParams.get("addInfo"), "BINO123456");
  assert.equal(url.searchParams.get("accountName"), "TRAN GIA BAO");
});
