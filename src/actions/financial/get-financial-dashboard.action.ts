import { transactionsService } from "../../services/transactions.service";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";
import { FinancialSummaryMapper } from "../../domain/financial/mappers/financial-summary.mapper";
import { FutureBalanceMapper } from "../../domain/financial/mappers/future-balance.mapper";
import { FinancialFlowMapper } from "../../domain/financial/mappers/financial-flow.mapper";

export async function getFinancialDashboardAction(
familyMemberId: string,
startDate: Date,
endDate: Date,
currentBalance: number,
spendingLimit?: number
) {

const period =
new FinancialPeriod(
startDate,
endDate
);

const result =
await transactionsService.calculateDashboard(
familyMemberId,
period,
currentBalance,
spendingLimit
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
