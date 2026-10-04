import { transactionsService } from "../../services/transactions.service";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";
import { FutureBalanceMapper } from "../../domain/financial/mappers/future-balance.mapper";
import { accountBalanceService } from "../../services/account-balance.service";


export async function calculateFutureBalanceAction(
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