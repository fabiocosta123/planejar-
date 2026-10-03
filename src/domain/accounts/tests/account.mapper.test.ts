import { describe, expect, it } from "vitest";
import { AccountMapper } from "../mappers/account.mapper";


describe("AccountMapper", () => {


  it("deve converter dados persistidos para Account de domínio", () => {


    const data = {

      id: "account-1",
      name: "Conta Corrente",
      type: "CHECKING" as const,
      initialBalance: 1500,
      initialBalanceDate: new Date("2026-08-01")

    };


    const account =
      AccountMapper.toDomain(
        data,
        
      );


    expect(
      account.id
    )
    .toBe(
      "account-1"
    );


    expect(
      account.name
    )
    .toBe(
      "Conta Corrente"
    );


    expect(
      account.type
    )
    .toBe(
      "CHECKING"
    );


    expect(
      account.currentBalance
    )
    .toBe(
      1500
    );


  });



  it("deve converter Decimal para número no domínio", () => {


    const data = {

      id: "account-2",

      name: "Poupança",

      type: "SAVINGS" as const,

      initialBalance:
        "2500.50",
      initialBalanceDate: new Date("2026-08-01")

    };


    const account =
      AccountMapper.toDomain(
        data
      );


    expect(
      account.currentBalance
    )
    .toBe(
      2500.50
    );


  });


});