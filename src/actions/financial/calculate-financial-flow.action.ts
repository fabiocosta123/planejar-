import { transactionsService } from "../../services/transactions.service";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";
import { FinancialFlowMapper } from "../../domain/financial/mappers/financial-flow.mapper";
import { accountBalanceService } from "../../services/account-balance.service";

export async function calculateFinancialFlowAction(
  familyMemberId: string,
  startDate: Date,
  endDate: Date
) {

  const period =
    new FinancialPeriod(
      startDate,
      endDate
    );

  const currentBalance =
    await accountBalanceService.calculateCurrentBalance(
      familyMemberId
    );

  const flow =
    await transactionsService.calculateFinancialFlow(
      familyMemberId,
      period,
      currentBalance
    );

  return FinancialFlowMapper.toContracts(
    flow
  );

}