import { FutureBalanceResult } from "../models/future-balance-result";
import { FutureBalanceContract } from "../../../contracts/financial/future-balance.contract";


export class FutureBalanceMapper {

  static toContract(
    result: FutureBalanceResult
  ): FutureBalanceContract {

    return {

      currentBalance:
        result.currentBalance,

      futureIncome:
        result.futureIncome,

      futureExpenses:
        result.futureExpenses,

      futureBalance:
        result.futureBalance,

      isPositive:
        result.isPositive,

      isNegative:
        result.isNegative

    };

  }

}