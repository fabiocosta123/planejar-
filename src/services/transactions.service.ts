import { transactionsRepository } from "../repositories/transactions.repository";
import { FinancialPeriod } from "../domain/financial/models/financial-period";
import { financialEngine } from "../domain/financial/engine/financial-engine";


export class TransactionsService {


  async calculateSummary(
    familyMemberId: string,
    period: FinancialPeriod,
    spendingLimit?: number
  ) {


    const transactions =
      await transactionsRepository.findByPeriod(
        familyMemberId,
        period
      );


    return financialEngine.calculateSummary(
      transactions,
      spendingLimit      
    );

  }

}


export const transactionsService =
  new TransactionsService();