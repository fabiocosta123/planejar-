export class FinancialSummary {

  constructor(
    public readonly currentBalance: number,
    public readonly income: number,
    public readonly expenses: number,
    public readonly limitExceeded: boolean
  ) {}

  get hasPositiveBalance(): boolean {
    return this.currentBalance >= 0;
  }

  get hasNegativeBalance(): boolean {
    return this.currentBalance < 0;
  }

}