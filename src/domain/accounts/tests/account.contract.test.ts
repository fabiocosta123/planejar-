import { describe, expect, it } from "vitest";
import { AccountMapper } from "../mappers/account.mapper";
import { Account } from "../models/account";


describe("AccountContract", () => {


  it("deve converter Account de domínio para contrato", () => {


    const account =
      new Account(

        "account-1",

        "Banco Principal",

        "CHECKING",

        2500

      );


    const contract =
      AccountMapper.toContract(
        account
      );


    expect(
      contract
    )
    .toEqual({

      id: "account-1",

      name: "Banco Principal",

      type: "CHECKING",

      balance: 2500

    });


  });


});