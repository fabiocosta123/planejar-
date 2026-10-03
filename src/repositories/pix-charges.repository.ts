import { prisma } from "../lib/prisma";

export interface PixChargeRecord {
  id: string;
  userId: string;
  idFaturaPag: string;
  amount: number;
  status: "PENDING" | "PAID" | "REFUNDED";
  copyPaste: string;
  expiresAt: Date;
}

function toRecord(charge: {
  id: string;
  userId: string;
  idFaturaPag: string;
  amount: { toString(): string } | number;
  status: "PENDING" | "PAID" | "REFUNDED";
  copyPaste: string;
  expiresAt: Date;
}): PixChargeRecord {
  return {
    id: charge.id,
    userId: charge.userId,
    idFaturaPag: charge.idFaturaPag,
    amount: Number(charge.amount),
    status: charge.status,
    copyPaste: charge.copyPaste,
    expiresAt: charge.expiresAt,
  };
}

export class PixChargesRepository {
  async findReusablePending(userId: string, now: Date) {
    const charge = await prisma.pixCharge.findFirst({
      where: {
        userId,
        status: "PENDING",
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: "desc" },
    });

    return charge ? toRecord(charge) : null;
  }

  async createPending(input: {
    userId: string;
    idFaturaPag: string;
    amount: number;
    copyPaste: string;
    expiresAt: Date;
  }) {
    const charge = await prisma.pixCharge.create({
      data: input,
    });

    return toRecord(charge);
  }

  async findOwned(userId: string, idFaturaPag: string) {
    const charge = await prisma.pixCharge.findFirst({
      where: { userId, idFaturaPag },
    });

    return charge ? toRecord(charge) : null;
  }

  async findByFatura(idFaturaPag: string) {
    const charge = await prisma.pixCharge.findUnique({
      where: { idFaturaPag },
    });

    return charge ? toRecord(charge) : null;
  }

  async grantPro(chargeId: string, userId: string, paidAt: Date) {
    await prisma.$transaction(async (tx) => {
      await tx.pixCharge.updateMany({
        where: {
          id: chargeId,
          userId,
          status: "PENDING",
        },
        data: {
          status: "PAID",
          paidAt,
        },
      });

      await tx.userSettings.upsert({
        where: { userId },
        update: { plan: "PRO" },
        create: { userId, plan: "PRO" },
      });
    });
  }

  async refund(chargeId: string, userId: string, refundedAt: Date) {
    await prisma.$transaction(async (tx) => {
      await tx.pixCharge.updateMany({
        where: {
          id: chargeId,
          userId,
          status: "PAID",
        },
        data: {
          status: "REFUNDED",
          refundedAt,
        },
      });

      const remaining = await tx.pixCharge.count({
        where: {
          userId,
          status: "PAID",
        },
      });

      if (remaining === 0) {
        await tx.userSettings.updateMany({
          where: { userId },
          data: { plan: "FREE" },
        });
      }
    });
  }

  async hasEvent(id: string) {
    const event = await prisma.pixWebhookEvent.findUnique({
      where: { id },
      select: { id: true },
    });

    return event !== null;
  }

  async rememberEvent(id: string, tipo: string, idFaturaPag: string) {
    await prisma.pixWebhookEvent.create({
      data: { id, tipo, idFaturaPag },
    });
  }
}

export const pixChargesRepository = new PixChargesRepository();
