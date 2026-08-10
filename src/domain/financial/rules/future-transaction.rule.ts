import { TransactionInput } from "../models/transaction-input";

export class FutureTransactionRule {

  isFuture(
    transaction: TransactionInput,
    referenceDate: Date
  ): boolean {

    const transactionDay =
      new Date(transaction.transactionDate);

    const referenceDay =
      new Date(referenceDate);

    transactionDay.setHours(
      0,
      0,
      0,
      0
    );

    referenceDay.setHours(
      0,
      0,
      0,
      0
    );

    return (
      transactionDay >
      referenceDay
    );

  }


  filterFuture(
    transactions: TransactionInput[],
    referenceDate: Date
  ): TransactionInput[] {

    return transactions.filter(
      transaction =>
        this.isFuture(
          transaction,
          referenceDate
        )
    );

  }

}