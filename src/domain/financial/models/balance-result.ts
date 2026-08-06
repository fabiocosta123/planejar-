export class BalanceResult {
  constructor(
    public readonly income: number,
    public readonly expenses: number
  ) {}

  get balance(): number {
    return this.income - this.expenses;
  }

  get isPositive(): boolean {
    return this.balance >= 0;
  }
}