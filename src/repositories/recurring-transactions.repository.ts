import { prisma } from "../lib/prisma";

export interface CreateRecurringTransactionInput {
  familyMemberId: string;
  accountId: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  startDate: Date;
  dayOfMonth: number;
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
        frequency: "MONTHLY",
        startDate: data.startDate,
        dayOfMonth: data.dayOfMonth,
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

  async updateOwned(
    id: string,
    familyMemberId: string,
    data: {
      accountId: string;
      description: string;
      amount: number;
      type: "INCOME" | "EXPENSE";
      dayOfMonth: number;
    }
  ) {
    return prisma.recurringTransaction.updateMany({
      where: {
        id,
        familyMemberId,
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
