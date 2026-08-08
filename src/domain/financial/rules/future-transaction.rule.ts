import { TransactionInput } from "../models/transaction-input";


export class FutureTransactionRule {

  isFuture(
    transaction: TransactionInput,
    referenceDate: Date
  ): boolean {

    return (
      transaction.transactionDate >
      referenceDate
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