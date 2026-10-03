import { TightDayResult } from "../models/tight-day-result";
import { TightDayContract } from "../../../contracts/financial/tight-day.contract";

export class TightDayMapper {

  static toContract(
    result: TightDayResult | null
  ): TightDayContract | null {

    if (!result) {
      return null;
    }

    return {
      date: result.date,
      balance: result.balance,
      minimumReserve: result.minimumReserve,
      shortfall: result.shortfall,
      daysRemaining: result.daysRemaining,
      dailyAmount: result.dailyAmount,
    };
  }

}
