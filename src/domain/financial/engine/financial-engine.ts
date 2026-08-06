import { BalanceEngine } from "./balance-engine";
import { TransactionInput } from "../models/transaction-input";
import { FinancialSummary } from "../models/financial-summary";
import { IncomeExpenseRule } from "../rules/income-expense-rule";
import { SpendingLimitRule } from "../rules/spending-limit-rule";


export class FinancialEngine {

  private readonly balanceEngine =
    new BalanceEngine();

  private readonly incomeExpenseRule =
    new IncomeExpenseRule();

  private createSpendingLimitRule(
  limit: number
): SpendingLimitRule {
  return new SpendingLimitRule(limit);
}


  calculateSummary(
    transactions: TransactionInput[],
    spendingLimit?: number
  ): FinancialSummary {


    const {
      income,
      expenses
    } =
      this.incomeExpenseRule.calculate(
        transactions
      );


    const balance =
      this.balanceEngine.calculate(
        income,
        expenses
      );


    const limitExceeded =
  spendingLimit !== undefined
    ? this.createSpendingLimitRule(spendingLimit)
        .isExceeded(expenses)
    : false;


    return new FinancialSummary(
      income,
      expenses,
      balance.balance,
      limitExceeded
    );
  }
}


export const financialEngine =
  new FinancialEngine();