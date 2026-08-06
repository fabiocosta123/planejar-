import { TransactionInput } from "../models/transaction-input";

export class IncomeExpenseRule {

  calculateIncome(
    transactions: TransactionInput[]
  ): number {

    return transactions
      .filter(transaction => transaction.type === "INCOME")
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );
  }


  calculateExpenses(
    transactions: TransactionInput[]
  ): number {

    return transactions
      .filter(transaction => transaction.type === "EXPENSE")
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );
  }
}


export const incomeExpenseRule = new IncomeExpenseRule();