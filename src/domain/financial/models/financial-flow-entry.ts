export class FinancialFlowEntry {

  constructor(
    public readonly date: Date,
    public readonly income: number,
    public readonly expenses: number,
    public readonly balance: number
  ) {}


  get isPositive(): boolean {
    return this.balance >= 0;
  }


  get isNegative(): boolean {
    return this.balance < 0;
  }

}