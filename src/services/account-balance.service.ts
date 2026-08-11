import { accountsRepository } from "../repositories/accounts.repository";
import { transactionsRepository } from "../repositories/transactions.repository";
import { financialEngine } from "../domain/financial/engine/financial-engine";


export class AccountBalanceService {

  async calculateCurrentBalance(
    familyMemberId: string,
    referenceDate: Date = new Date()
  ): Promise<number> {

    const accounts =
      await accountsRepository.findByFamilyMember(
        familyMemberId
      );


    let totalBalance = 0;


    for (const account of accounts) {

      const transactions =
        await transactionsRepository.findByAccountId(
          account.id
        );


      const accountBalance =
        financialEngine.calculateCurrentBalance(
          account.initialBalance,
          transactions,
          referenceDate
        );


      totalBalance += accountBalance;

    }


    return totalBalance;

  }

}


export const accountBalanceService =
  new AccountBalanceService();