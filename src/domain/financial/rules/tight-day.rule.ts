import { TransactionInput } from "../models/transaction-input";
import { TightDayResult } from "../models/tight-day-result";

export class TightDayRule {

  calculate(
    currentBalance: number,
    transactions: TransactionInput[],
    referenceDate: Date,
    minimumReserve = 0
  ): TightDayResult | null {

    const reserve = roundMoney(minimumReserve);
    const opening = roundMoney(currentBalance);

    if (opening < reserve) {
      return this.build(
        referenceDate,
        opening,
        reserve,
        referenceDate
      );
    }

    const futureTransactions =
      transactions
        .filter(
          (transaction) =>
            transaction.status !== "CANCELED" &&
            this.isAfterDay(
              transaction.transactionDate,
              referenceDate
            )
        )
        .sort(
          (a, b) =>
            a.transactionDate.getTime() -
            b.transactionDate.getTime()
        );

    let balance = opening;
    let index = 0;

    while (index < futureTransactions.length) {
      const currentDate =
        futureTransactions[index].transactionDate;

      let dailyIncome = 0;
      let dailyExpenses = 0;

      while (
        index < futureTransactions.length &&
        this.isSameDay(
          futureTransactions[index].transactionDate,
          currentDate
        )
      ) {
        const transaction = futureTransactions[index];

        if (transaction.type === "INCOME") {
          dailyIncome += transaction.amount;
        } else {
          dailyExpenses += transaction.amount;
        }

        index++;
      }

      balance = roundMoney(
        balance + dailyIncome - dailyExpenses
      );

      if (balance < reserve) {
        return this.build(
          currentDate,
          balance,
          reserve,
          referenceDate
        );
      }
    }

    return null;
  }

  private build(
    date: Date,
    balance: number,
    minimumReserve: number,
    referenceDate: Date
  ): TightDayResult {

    const shortfall = roundMoney(
      minimumReserve - balance
    );

    const daysRemaining = Math.max(
      1,
      daysBetween(referenceDate, date)
    );

    return new TightDayResult(
      startOfDay(date),
      balance,
      minimumReserve,
      daysRemaining,
      ceilMoney(shortfall / daysRemaining)
    );
  }

  private isAfterDay(
    date: Date,
    referenceDate: Date
  ): boolean {

    return (
      startOfDay(date).getTime() >
      startOfDay(referenceDate).getTime()
    );
  }

  private isSameDay(
    first: Date,
    second: Date
  ): boolean {

    const firstDay = startOfDay(first);
    const secondDay = startOfDay(second);

    return firstDay.getTime() === secondDay.getTime();
  }

}

function startOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function daysBetween(
  from: Date,
  to: Date
): number {

  const milliseconds =
    startOfDay(to).getTime() -
    startOfDay(from).getTime();

  return Math.round(milliseconds / 86_400_000);
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function ceilMoney(value: number): number {
  return Math.ceil(
    (value * 100) - 0.000001
  ) / 100;
}

export const tightDayRule = new TightDayRule();
