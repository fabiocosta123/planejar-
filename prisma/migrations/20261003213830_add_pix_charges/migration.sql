-- CreateEnum
CREATE TYPE "PixChargeStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED');

-- CreateTable
CREATE TABLE "pix_charges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "idFaturaPag" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "PixChargeStatus" NOT NULL DEFAULT 'PENDING',
    "copyPaste" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pix_charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pix_webhook_events" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "idFaturaPag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pix_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pix_charges_idFaturaPag_key" ON "pix_charges"("idFaturaPag");

-- CreateIndex
CREATE INDEX "pix_charges_userId_status_idx" ON "pix_charges"("userId", "status");

-- AddForeignKey
ALTER TABLE "pix_charges" ADD CONSTRAINT "pix_charges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
