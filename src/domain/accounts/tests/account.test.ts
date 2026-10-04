import { describe, expect, it } from "vitest";
import { Account } from "../models/account";


describe("Account", () => {


  it("deve criar uma conta com saldo inicial", () => {

    const account =
      new Account(
        "1",
        "Conta Corrente",
        "CHECKING",
        1000
      );


    expect(
      account.currentBalance
    ).toBe(1000);

  });



  it("deve adicionar crédito ao saldo", () => {

    const account =
      new Account(
        "1",
        "Carteira",
        "CASH"
      );


    account.credit(200);


    expect(
      account.currentBalance
    ).toBe(200);

  });



  it("deve remover débito do saldo", () => {

    const account =
      new Account(
        "1",
        "Conta",
        "CHECKING",
        500
      );


    account.debit(100);


    expect(
      account.currentBalance
    ).toBe(400);

  });



  it("não deve permitir nome vazio", () => {

    expect(
      () =>
        new Account(
          "1",
          "",
          "CHECKING"
        )
    ).toThrow();

  });


});