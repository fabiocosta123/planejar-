import { prisma } from "../lib/prisma";

export interface CreateRecurringTransactionInput {
  familyMemberId: string;
  accountId: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  startDate: Date;
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
    });
  }
}

export const recurringTransactionsRepository =
  new RecurringTransactionsRepository();
