import { TransactionInput } from "../models/transaction-input";
import { FinancialFlowEntry } from "../models/financial-flow-entry";


export class FinancialFlowEngine {


  calculate(
    initialBalance: number,
    transactions: TransactionInput[]
  ): FinancialFlowEntry[] {


    const sortedTransactions =
      [...transactions].sort(
        (a, b) =>
          a.transactionDate.getTime() -
          b.transactionDate.getTime()
      );


    const entries: FinancialFlowEntry[] = [];


    let currentBalance =
      initialBalance;


    let index = 0;


    while (
      index <
      sortedTransactions.length
    ) {


      const currentDate =
        sortedTransactions[index]
          .transactionDate;


      let dailyIncome = 0;

      let dailyExpenses = 0;


      while (
        index <
        sortedTransactions.length &&
        this.isSameDay(
          sortedTransactions[index]
            .transactionDate,
          currentDate
        )
      ) {


        const transaction =
          sortedTransactions[index];


        if (
          transaction.type === "INCOME"
        ) {

          dailyIncome +=
            transaction.amount;

        } else {

          dailyExpenses +=
            transaction.amount;

        }


        index++;

      }


      currentBalance =
        currentBalance
        + dailyIncome
        - dailyExpenses;


      entries.push(
        new FinancialFlowEntry(
          currentDate,
          dailyIncome,
          dailyExpenses,
          currentBalance
        )
      );

    }


    return entries;

  }


  private isSameDay(
    first: Date,
    second: Date
  ): boolean {

    return (
      first.getFullYear() ===
        second.getFullYear() &&

      first.getMonth() ===
        second.getMonth() &&

      first.getDate() ===
        second.getDate()
    );

  }

}


export const financialFlowEngine =
  new FinancialFlowEngine();