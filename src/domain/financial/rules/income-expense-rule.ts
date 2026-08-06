import { TransactionInput } from "../models/transaction-input";


export class IncomeExpenseRule {

  calculate(
    transactions: TransactionInput[]
  ) {

    const income =
      transactions
        .filter(
          transaction =>
            transaction.type === "INCOME"
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0
        );


    const expenses =
      transactions
        .filter(
          transaction =>
            transaction.type === "EXPENSE"
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0
        );


    return {
      income,
      expenses
    };
  }
}