import { FinancialSummary } from "../models/financial-summary";
import { FinancialSummaryContract } from "../../../contracts/financial/financial-summary.contract";

export class FinancialSummaryMapper {

  static toContract(
    summary: FinancialSummary
  ): FinancialSummaryContract {

    return {
      income: summary.income,
      expenses: summary.expenses,
      balance: summary.balance,
      limitExceeded: summary.limitExceeded
    };

  }

}