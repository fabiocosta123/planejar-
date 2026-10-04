export class FinancialPeriod {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date
  ) {
    if (startDate > endDate) {
      throw new Error(
        "A data inicial não pode ser maior que a data final"
      );
    }
  }

  contains(date: Date): boolean {
    return (
      date >= this.startDate &&
      date <= this.endDate
    );
  }

  static currentMonth(): FinancialPeriod {
    const now = new Date();

    return new FinancialPeriod(
      new Date(now.getFullYear(), now.getMonth(), 1),
      new Date(now.getFullYear(), now.getMonth() + 1, 0)
    );
  }
}