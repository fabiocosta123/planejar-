import { prisma } from "../lib/prisma";
import { FinancialPeriod } from "../domain/financial/models/financial-period";
import { TransactionMapper } from "./mappers/transaction.mapper";
import { CreateTransactionInput } from "../contracts/transactions/create-transaction.input";

export class TransactionsRepository {

  async create(
    data: CreateTransactionInput
  ) {

    const transaction =
      await prisma.transaction.create({
        data: {
          familyMemberId:
            data.familyMemberId,

          accountId:
            data.accountId,

          description:
            data.description,

          notes:
            data.notes,

          amount:
            data.amount,

          type:
            data.type,

          status:
            data.status,

          transactionDate:
            data.transactionDate,
        },
      });

    return transaction;
  }


  async findByPeriod(
    familyMemberId: string,
    period: FinancialPeriod
  ) {
    const transactions = await prisma.transaction.findMany({
      where: {
        familyMemberId,
        deletedAt: null,
        transactionDate: {
          gte: period.startDate,
          lte: period.endDate,
        },
      },
      orderBy: {
        transactionDate: "desc",
      },
    });

    return transactions.map(TransactionMapper.toDomain);
  }


  async findSummaryByPeriod(
    familyMemberId: string,
    period: FinancialPeriod
  ) {
    return prisma.transaction.findMany({
      where: {
        familyMemberId,
        deletedAt: null,
        transactionDate: {
          gte: period.startDate,
          lte: period.endDate,
        },
      },
      orderBy: {
        transactionDate: "desc",
      },
    });
  }


  async findSummarySince(
    familyMemberId: string,
    startDate: Date | null
  ) {
    return prisma.transaction.findMany({
      where: {
        familyMemberId,
        deletedAt: null,
        ...(startDate
          ? {
              transactionDate: {
                gte: startDate,
              },
            }
          : {}),
      },
      orderBy: {
        transactionDate: "desc",
      },
    });
  }


  async findByAccountId(
    accountId: string
  ) {

    const transactions =
      await prisma.transaction.findMany({
        where: {
          accountId,
          deletedAt: null
        },
        orderBy: {
          transactionDate: "asc"
        }
      });

    return transactions.map(
      TransactionMapper.toDomain
    );
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