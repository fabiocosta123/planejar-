import { transactionsService } from "../../services/transactions.service";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";
import { FinancialFlowMapper } from "../../domain/financial/mappers/financial-flow.mapper";

export async function calculateFinancialFlowAction(
familyMemberId: string,
startDate: Date,
endDate: Date,
initialBalance: number
) {

const period =
new FinancialPeriod(
startDate,
endDate
);

const flow =
await transactionsService.calculateFinancialFlow(
familyMemberId,
period,
initialBalance
);

return FinancialFlowMapper.toContracts(
flow
);

}
