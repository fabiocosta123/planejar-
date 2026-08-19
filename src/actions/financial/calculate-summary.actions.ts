import { transactionsService } from "../../services/transactions.service";
import { accountBalanceService } from "../../services/account-balance.service";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";
import { FinancialSummaryMapper } from "../../domain/financial/mappers/financial-summary.mapper";

export async function calculateFinancialSummaryAction(
  familyMemberId: string,
  startDate: Date,
  endDate: Date,
  spendingLimit?: number,
  referenceDate: Date = new Date()
) {

  const period =
    new FinancialPeriod(
      startDate,
      endDate
    );

  const currentBalance =
    await accountBalanceService.calculateCurrentBalance(
      familyMemberId,
      referenceDate
    );

  const summary =
    await transactionsService.calculateSummary(
      familyMemberId,
      period,
      currentBalance,
      spendingLimit
    );

  return FinancialSummaryMapper.toContract(
    summary
  );

}