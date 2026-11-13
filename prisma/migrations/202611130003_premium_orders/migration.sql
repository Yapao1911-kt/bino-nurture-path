ALTER TABLE "User" ADD COLUMN "premiumEndsAt" TIMESTAMP(3);
CREATE TABLE "PremiumOrder" (
 "id" TEXT NOT NULL PRIMARY KEY, "code" TEXT NOT NULL, "userId" TEXT NOT NULL,
 "amount" INTEGER NOT NULL, "days" INTEGER NOT NULL, "status" TEXT NOT NULL DEFAULT 'PENDING',
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "expiresAt" TIMESTAMP(3) NOT NULL,
 "submittedAt" TIMESTAMP(3), "reviewedAt" TIMESTAMP(3), "reviewedBy" TEXT,
 "bankReference" TEXT, "reviewNote" TEXT, "grantedUntil" TIMESTAMP(3),
 CONSTRAINT "PremiumOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT "PremiumOrder_amount_check" CHECK ("amount" > 0 AND "days" > 0),
 CONSTRAINT "PremiumOrder_status_check" CHECK ("status" IN ('PENDING','AWAITING_REVIEW','PAID','REJECTED','CANCELLED','EXPIRED'))
);
CREATE UNIQUE INDEX "PremiumOrder_code_key" ON "PremiumOrder"("code");
CREATE UNIQUE INDEX "PremiumOrder_bankReference_key" ON "PremiumOrder"("bankReference");
CREATE INDEX "PremiumOrder_userId_createdAt_idx" ON "PremiumOrder"("userId","createdAt");
CREATE INDEX "PremiumOrder_status_createdAt_idx" ON "PremiumOrder"("status","createdAt");
