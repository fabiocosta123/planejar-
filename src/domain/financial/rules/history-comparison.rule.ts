export interface HistoryTransaction {
  amount: number;
  type: "INCOME" | "EXPENSE";
  status: "PENDING" | "COMPLETED" | "CANCELED";
  transactionDate: Date;
}

export interface PeriodTotals {
  income: number;
  expenses: number;
}

export class HistoryComparison {

  constructor(
    public readonly currentMonth: Date,
    public readonly previousMonth: Date,
    public readonly currentYear: number,
    public readonly previousYear: number,
    public readonly monthCurrent: PeriodTotals,
    public readonly monthPrevious: PeriodTotals,
    public readonly yearCurrent: PeriodTotals,
    public readonly yearPrevious: PeriodTotals
  ) {}

  get monthIncomeDifference(): number {
    return roundMoney(
      this.monthCurrent.income - this.monthPrevious.income
    );
  }

  get monthExpenseDifference(): number {
    return roundMoney(
      this.monthCurrent.expenses - this.monthPrevious.expenses
    );
  }

  get yearIncomeDifference(): number {
    return roundMoney(
      this.yearCurrent.income - this.yearPrevious.income
    );
  }

  get yearExpenseDifference(): number {
    return roundMoney(
      this.yearCurrent.expenses - this.yearPrevious.expenses
    );
  }

}

export class HistoryComparisonRule {

  compare(
    transactions: HistoryTransaction[],
    referenceDate: Date
  ): HistoryComparison {

    const currentMonth = startOfMonth(referenceDate);
    const previousMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );

    return new HistoryComparison(
      currentMonth,
      previousMonth,
      referenceDate.getFullYear(),
      referenceDate.getFullYear() - 1,
      this.sum(
        transactions,
        currentMonth,
        endOfMonth(currentMonth)
      ),
      this.sum(
        transactions,
        previousMonth,
        endOfMonth(previousMonth)
      ),
      this.sum(
        transactions,
        new Date(referenceDate.getFullYear(), 0, 1),
        new Date(referenceDate.getFullYear(), 11, 31, 23, 59, 59, 999)
      ),
      this.sum(
        transactions,
        new Date(referenceDate.getFullYear() - 1, 0, 1),
        new Date(referenceDate.getFullYear() - 1, 11, 31, 23, 59, 59, 999)
      )
    );
  }

  sum(
    transactions: HistoryTransaction[],
    start: Date,
    end: Date
  ): PeriodTotals {

    const totals = transactions
      .filter((transaction) => transaction.status !== "CANCELED")
      .filter((transaction) => {
        const time = transaction.transactionDate.getTime();
        return time >= start.getTime() && time <= end.getTime();
      })
      .reduce(
        (result, transaction) => {
          if (transaction.type === "INCOME") {
            result.income += transaction.amount;
          } else {
            result.expenses += transaction.amount;
          }

          return result;
        },
        { income: 0, expenses: 0 }
      );

    return {
      income: roundMoney(totals.income),
      expenses: roundMoney(totals.expenses),
    };
  }

}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export const historyComparisonRule = new HistoryComparisonRule();
