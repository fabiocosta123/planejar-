import { prisma } from "../lib/prisma";

export interface CreateRecurringTransactionInput {
  familyMemberId: string;
  accountId: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  startDate: Date;
  dayOfMonth: number;
  frequency?: "MONTHLY" | "DAILY";
  weekdays?: number[];
  endDate?: Date | null;
}

export class RecurringTransactionsRepository {
  async create(data: CreateRecurringTransactionInput) {
    return prisma.recurringTransaction.create({
      data: {
        familyMemberId: data.familyMemberId,
        accountId: data.accountId,
        description: data.description,
        amount: data.amount,
        type: data.type,
        frequency: data.frequency ?? "MONTHLY",
        startDate: data.startDate,
        dayOfMonth: data.dayOfMonth,
        weekdays: data.weekdays ?? [],
        endDate: data.endDate ?? null,
      },
    });
  }

  async findActiveByFamilyMember(familyMemberId: string) {
    return prisma.recurringTransaction.findMany({
      where: {
        familyMemberId,
        deletedAt: null,
        isActive: true,
        account: {
          deletedAt: null,
          isActive: true,
        },
      },
      include: {
        account: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        description: "asc",
      },
    });
  }

  async findActiveOwned(id: string, familyMemberId: string) {
    return prisma.recurringTransaction.findFirst({
      where: {
        id,
        familyMemberId,
        deletedAt: null,
        isActive: true,
      },
    });
  }

  async updateOwned(
    id: string,
    familyMemberId: string,
    data: {
      accountId: string;
      description: string;
      amount: number;
      type: "INCOME" | "EXPENSE";
      dayOfMonth?: number;
      weekdays?: number[];
      endDate?: Date | null;
    },
    frequency: "MONTHLY" | "DAILY"
  ) {
    return prisma.recurringTransaction.updateMany({
      where: {
        id,
        familyMemberId,
        frequency,
        deletedAt: null,
        isActive: true,
      },
      data,
    });
  }

  async deactivateOwned(id: string, familyMemberId: string) {
    return prisma.recurringTransaction.updateMany({
      where: {
        id,
        familyMemberId,
        deletedAt: null,
        isActive: true,
      },
      data: {
        isActive: false,
        endDate: new Date(),
      },
    });
  }
}

export const recurringTransactionsRepository =
  new RecurringTransactionsRepository();
