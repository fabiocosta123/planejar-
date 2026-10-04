import { BalanceResult } from "../models/balance-result";

export class BalanceEngine {

  calculate(
    income: number,
    expenses: number
  ): BalanceResult {

    return new BalanceResult(
      income,
      expenses
    );
  }
}

export const balanceEngine = new BalanceEngine();