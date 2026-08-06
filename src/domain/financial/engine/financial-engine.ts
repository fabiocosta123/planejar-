import { BalanceEngine } from "./balance-engine";
import { IncomeExpenseRule } from "../rules/income-expense-rule";
import { TransactionInput } from "../models/transaction-input";


export class FinancialEngine {

  constructor(
    private readonly incomeExpenseRule = new IncomeExpenseRule(),
    private readonly balanceEngine = new BalanceEngine()
  ) {}


  analyze(
    transactions: TransactionInput[]
  ) {

    const income =
      this.incomeExpenseRule.calculateIncome(
        transactions
      );


    const expenses =
      this.incomeExpenseRule.calculateExpenses(
        transactions
      );


    return this.balanceEngine.calculate(
      income,
      expenses
    );
  }
}


export const financialEngine =
  new FinancialEngine();