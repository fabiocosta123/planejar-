import { transactionsService } from "../../services/transactions.service";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";


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


  return transactionsService.calculateSummary(
    familyMemberId,
    period,
    spendingLimit
  );

}