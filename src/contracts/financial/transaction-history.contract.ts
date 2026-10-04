import { HistoryComparison } from "../../domain/financial/rules/history-comparison.rule";
import { SubscriptionPlan } from "../../domain/financial/rules/transaction-history-window.rule";
import { TransactionSummaryContract } from "./transaction-summary.contract";

export interface PeriodTotalsContract {
  income: number;
  expenses: number;
}

export interface HistoryComparisonContract {
  currentMonth: Date;
  previousMonth: Date;
  currentYear: number;
  previousYear: number;
  monthCurrent: PeriodTotalsContract;
  monthPrevious: PeriodTotalsContract;
  monthIncomeDifference: number;
  monthExpenseDifference: number;
  yearCurrent: PeriodTotalsContract;
  yearPrevious: PeriodTotalsContract;
  yearIncomeDifference: number;
  yearExpenseDifference: number;
}

export interface TransactionHistoryContract {
  plan: SubscriptionPlan;
  historyStart: Date | null;
  transactions: TransactionSummaryContract[];
  currentMonth: PeriodTotalsContract;
  comparison: HistoryComparisonContract | null;
}

export function toComparisonContract(
  comparison: HistoryComparison
): HistoryComparisonContract {
  return {
    currentMonth: comparison.currentMonth,
    previousMonth: comparison.previousMonth,
    currentYear: comparison.currentYear,
    previousYear: comparison.previousYear,
    monthCurrent: comparison.monthCurrent,
    monthPrevious: comparison.monthPrevious,
    monthIncomeDifference: comparison.monthIncomeDifference,
    monthExpenseDifference: comparison.monthExpenseDifference,
    yearCurrent: comparison.yearCurrent,
    yearPrevious: comparison.yearPrevious,
    yearIncomeDifference: comparison.yearIncomeDifference,
    yearExpenseDifference: comparison.yearExpenseDifference,
  };
}
