import { accountsRepository } from "../repositories/accounts.repository";
import { AccountMapper } from "../domain/accounts/mappers/account.mapper";


export class AccountsService {


  async findById(
    id: string
  ) {


    const account =
      await accountsRepository.findById(
        id
      );


    if (!account) {

      return null;

    }


    const domainAccount =
      AccountMapper.toDomain(
        account
      );


    return AccountMapper.toContract(
      domainAccount
    );

  }




  async findByFamilyMember(
    familyMemberId: string
  ) {


    const accounts =
      await accountsRepository.findByFamilyMember(
        familyMemberId
      );


    return accounts.map(
      account =>
        AccountMapper.toContract(
          AccountMapper.toDomain(
            account
          )
        )
    );

  }




  async create(
    data: {
      familyMemberId: string;

      name: string;

      type:
        | "CHECKING"
        | "SAVINGS"
        | "CASH"
        | "INVESTMENT"
        | "OTHER";

      initialBalanceDate: Date;

      initialBalance: number;

    }
  ) {


    const account =
      await accountsRepository.create(
        data
      );


    return AccountMapper.toContract(

      AccountMapper.toDomain(
        account
      )

    );

  }


}


export const accountsService =
  new AccountsService();