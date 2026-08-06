export class FinancialSummary {

  constructor(
    public readonly income: number,
    public readonly expenses: number,
    public readonly projectedBalance: number
  ) {}

  get balance(): number {
    return this.income - this.expenses;
  }

  get hasPositiveBalance(): boolean {
    return this.balance >= 0;
  }
}