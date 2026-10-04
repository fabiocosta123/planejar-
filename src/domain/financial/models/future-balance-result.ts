export class FutureBalanceResult {

  constructor(
    public readonly currentBalance: number,
    public readonly futureIncome: number,
    public readonly futureExpenses: number
  ) {}

  get futureBalance(): number {
    return (
      this.currentBalance +
      this.futureIncome -
      this.futureExpenses
    );
  }

  get isPositive(): boolean {
    return this.futureBalance >= 0;
  }

  get isNegative(): boolean {
    return this.futureBalance < 0;
  }
}