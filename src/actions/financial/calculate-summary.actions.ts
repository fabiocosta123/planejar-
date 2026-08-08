import { transactionsService } from "../../services/transactions.service";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";
import { FinancialSummaryMapper } from "../../domain/financial/mappers/financial-summary.mapper";

export async function calculateFinancialSummaryAction(
  familyMemberId: string,
  startDate: Date,
  endDate: Date,
  spendingLimit?: number
) {

  const period =
    new FinancialPeriod(
      startDate,
      endDate
    );

  const summary =
    await transactionsService.calculateSummary(
      familyMemberId,
      period,
      spendingLimit
    );

  return FinancialSummaryMapper.toContract(
    summary
  );

}