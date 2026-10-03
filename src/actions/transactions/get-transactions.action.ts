import { transactionsService } from "../../services/transactions.service";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";

export async function getTransactionsAction(
  familyMemberId: string,
  startDate: Date,
  endDate: Date
) {

  const period =
    new FinancialPeriod(
      startDate,
      endDate
    );

  return transactionsService.findSummaryByPeriod(
    familyMemberId,
    period
  );

}