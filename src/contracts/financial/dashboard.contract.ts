import { FinancialSummaryContract } from "./financial-summary.contract";
import { FutureBalanceContract } from "./future-balance.contract";
import { FinancialFlowContract } from "./financial-flow.contract";

export interface DashboardContract {

summary: FinancialSummaryContract;

futureBalance: FutureBalanceContract;

financialFlow: FinancialFlowContract[];

}
