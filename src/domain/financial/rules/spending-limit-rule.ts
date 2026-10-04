export class SpendingLimitRule {

  constructor(
    private readonly limit: number
  ) {}

  isExceeded(expenses: number): boolean {
    return expenses > this.limit;
  }

  remaining(expenses: number): number {
    return this.limit - expenses;
  }
}