import { prisma } from "../lib/prisma";
import { FinancialPeriod } from "../domain/financial/models/financial-period";

export class TransactionsRepository {

  async findByPeriod(
    familyMemberId: string,
    period: FinancialPeriod
  ) {
    return prisma.transaction.findMany({
      where: {
        familyMemberId,
        transactionDate: {
          gte: period.startDate,
          lte: period.endDate,
        },
      },
      orderBy: {
        transactionDate: "asc",
      },
    });
  }


  async findIncomeByPeriod(
    familyMemberId: string,
    period: FinancialPeriod
  ) {
    return prisma.transaction.findMany({
      where: {
        familyMemberId,
        type: "INCOME",
        transactionDate: {
          gte: period.startDate,
          lte: period.endDate,
        },
      },
    });
  }


  async findExpensesByPeriod(
    familyMemberId: string,
    period: FinancialPeriod
  ) {
    return prisma.transaction.findMany({
      where: {
        familyMemberId,
        type: "EXPENSE",
        transactionDate: {
          gte: period.startDate,
          lte: period.endDate,
        },
      },
    });
  }
}


export const transactionsRepository =
  new TransactionsRepository();