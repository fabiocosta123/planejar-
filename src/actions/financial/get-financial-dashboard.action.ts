import { transactionsService } from "../../services/transactions.service";
import { accountBalanceService } from "../../services/account-balance.service";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";
import { FinancialSummaryMapper } from "../../domain/financial/mappers/financial-summary.mapper";
import { FutureBalanceMapper } from "../../domain/financial/mappers/future-balance.mapper";
import { FinancialFlowMapper } from "../../domain/financial/mappers/financial-flow.mapper";

export async function getFinancialDashboardAction(
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

  const result =
    await transactionsService.calculateDashboard(
      familyMemberId,
      period,
      currentBalance,
      spendingLimit,
      referenceDate
    );

  return {

    summary:
      FinancialSummaryMapper.toContract(
        result.summary
      ),

    futureBalance:
      FutureBalanceMapper.toContract(
        result.futureBalance
      ),

    financialFlow:
      FinancialFlowMapper.toContracts(
        result.financialFlow
      )

  };

}