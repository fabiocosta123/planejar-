import { transactionsRepository } from "../repositories/transactions.repository";
import { FinancialPeriod } from "../domain/financial/models/financial-period";
import { balanceEngine } from "../domain/financial/engine/balance-engine";


export class TransactionsService {

  async calculateBalance(
    familyMemberId: string,
    period: FinancialPeriod
  ) {

    const transactions =
      await transactionsRepository.findByPeriod(
        familyMemberId,
        period
      );


    const income = transactions
      .filter(transaction => transaction.type === "INCOME")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );


    const expenses = transactions
      .filter(transaction => transaction.type === "EXPENSE")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );


    return balanceEngine.calculate(
      income,
      expenses
    );
  }
}


export const transactionsService =
  new TransactionsService();