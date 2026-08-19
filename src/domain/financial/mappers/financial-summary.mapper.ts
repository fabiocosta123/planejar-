import { FinancialSummary } from "../models/financial-summary";
import { FinancialSummaryContract } from "../../../contracts/financial/financial-summary.contract";

export class FinancialSummaryMapper {

  static toContract(
    summary: FinancialSummary
  ): FinancialSummaryContract {

    return {
      currentBalance:
        summary.currentBalance,
      income:
        summary.income,
      expenses:
        summary.expenses,
      limitExceeded:
        summary.limitExceeded
    };

  }

}