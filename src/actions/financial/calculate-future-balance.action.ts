import { transactionsService } from "../../services/transactions.service";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";
import { FutureBalanceMapper } from "../../domain/financial/mappers/future-balance.mapper";


export async function calculateFutureBalanceAction(
  familyMemberId: string,
  startDate: Date,
  endDate: Date,
  currentBalance: number
) {

  const period =
    new FinancialPeriod(
      startDate,
      endDate
    );


  const result =
    await transactionsService.calculateFutureBalance(
      familyMemberId,
      period,
      currentBalance
    );


  return FutureBalanceMapper.toContract(
    result
  );

}