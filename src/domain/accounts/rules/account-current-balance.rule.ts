
import { TransactionInput } from "../../financial/models/transaction-input";


export class AccountCurrentBalanceRule {


  calculate(
    initialBalance: number,
    transactions: TransactionInput[],
    referenceDate: Date
  ): number {


    const completedTransactions =
      transactions.filter(
        transaction =>
          transaction.status === "COMPLETED" &&
          transaction.transactionDate <= referenceDate
      );


    return completedTransactions.reduce(
      (balance, transaction) => {

        if (transaction.type === "INCOME") {

          return balance + transaction.amount;

        }

        return balance - transaction.amount;

      },
      initialBalance
    );

  }

}

