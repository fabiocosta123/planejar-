import { FinancialFlowEntry } from "../models/financial-flow-entry";
import { FinancialFlowContract } from "../../../contracts/financial/financial-flow.contract";

export class FinancialFlowMapper {

static toContract(
entry: FinancialFlowEntry
): FinancialFlowContract {

return {

  date: entry.date,

  income: entry.income,

  expenses: entry.expenses,

  balance: entry.balance,

  isPositive: entry.isPositive,

  isNegative: entry.isNegative

};

}

static toContracts(
entries: FinancialFlowEntry[]
): FinancialFlowContract[] {

return entries.map(
  FinancialFlowMapper.toContract
);
}

}
