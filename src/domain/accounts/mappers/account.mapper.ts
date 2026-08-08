import { Account } from "../models/account";
import { AccountContract } from "../../../contracts/accounts/account.contract";
import { AccountPersistence } from "../../../contracts/accounts/account.persistence";


export class AccountMapper {


  static toDomain(
    data: AccountPersistence
  ): Account {


    return new Account(

      data.id,

      data.name,

      data.type,

      Number(
        data.initialBalance
      )

    );

  }



  static toContract(
    account: Account
  ): AccountContract {


    return {

      id: account.id,

      name: account.name,

      type: account.type,

      balance:
        account.currentBalance

    };

  }


}