import { BalanceEngine } from "./balance-engine";
import { TransactionInput } from "../models/transaction-input";
import { FinancialSummary } from "../models/financial-summary";
import { IncomeExpenseRule } from "../rules/income-expense-rule";
import { SpendingLimitRule } from "../rules/spending-limit-rule";
import { FutureBalanceResult } from "../models/future-balance-result";
import { FutureTransactionRule } from "../rules/future-transaction.rule";
import { CurrentBalanceRule } from "../rules/current-balance.rules";
import { AccountCurrentBalanceRule } from "../../accounts/rules/account-current-balance.rule";

export class FinancialEngine {

  private readonly accountCurrentBalanceRule = new AccountCurrentBalanceRule();

  private readonly currentBalanceRule = new CurrentBalanceRule();

  private readonly balanceEngine =
    new BalanceEngine();

  private readonly incomeExpenseRule =
    new IncomeExpenseRule();

  private createSpendingLimitRule(
    limit: number
  ): SpendingLimitRule {
    return new SpendingLimitRule(limit);
  }

  private readonly futureTransactionRule =
    new FutureTransactionRule();

  calculateCurrentBalance(
    initialBalance: number,
    transactions: TransactionInput[],
    referenceDate: Date
  ): number {

    return this.accountCurrentBalanceRule.calculate(
      initialBalance,
      transactions,
      referenceDate
    );

  }



  calculateFutureBalance(
    currentBalance: number,
    transactions: TransactionInput[],
    fromDate: Date
  ): FutureBalanceResult {

    const futureTransactions =
      this.futureTransactionRule.filterFuture(
        transactions,
        fromDate
      );


    const futureIncome =
      futureTransactions
        .filter(
          transaction =>
            transaction.type === "INCOME"
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0
        );


    const futureExpenses =
      futureTransactions
        .filter(
          transaction =>
            transaction.type === "EXPENSE"
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0
        );



    return new FutureBalanceResult(
      currentBalance,
      futureIncome,
      futureExpenses
    );

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