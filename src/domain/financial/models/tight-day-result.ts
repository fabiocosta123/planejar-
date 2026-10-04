export class TightDayResult {

  constructor(
    public readonly date: Date,
    public readonly balance: number,
    public readonly minimumReserve: number,
    public readonly daysRemaining: number,
    public readonly dailyAmount: number
  ) {}

  get shortfall(): number {
    return roundMoney(
      this.minimumReserve - this.balance
    );
  }

}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
