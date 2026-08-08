export class FinancialSummary {

  constructor(
    public readonly income: number,
    public readonly expenses: number,
    public readonly balance: number,
    public readonly limitExceeded: boolean
  ) {}


  get hasPositiveBalance(): boolean {
    return this.balance >= 0;
  }


  get hasNegativeBalance(): boolean {
    return this.balance < 0;
  }

}