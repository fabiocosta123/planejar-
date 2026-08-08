import { describe, expect, it } from "vitest";
import { Account } from "../models/account";
import { AccountBalanceRule } from "../rules/account-balance.rule";


describe("AccountBalanceRule", () => {


  it("deve permitir débito quando existe saldo", () => {

    const account =
      new Account(
        "1",
        "Conta Corrente",
        "CHECKING",
        500
      );


    const rule =
      new AccountBalanceRule();


    expect(
      rule.canDebit(
        account,
        200
      )
    )
      .toBe(true);

  });



  it("não deve permitir débito maior que o saldo", () => {

    const account =
      new Account(
        "1",
        "Carteira",
        "CASH",
        100
      );


    const rule =
      new AccountBalanceRule();


    expect(
      rule.canDebit(
        account,
        200
      )
    )
      .toBe(false);

  });



  it("deve identificar saldo negativo", () => {

    const account =
      new Account(
        "1",
        "Conta",
        "CHECKING",
        -50
      );


    const rule =
      new AccountBalanceRule();


    expect(
      rule.hasNegativeBalance(
        account
      )
    )
      .toBe(true);

  });



  it("deve calcular crédito corretamente", () => {

    const rule =
      new AccountBalanceRule();


    expect(
      rule.calculateAfterTransaction(
        100,
        50,
        "CREDIT"
      )
    )
      .toBe(150);

  });

  it("deve aplicar receita como crédito", () => {

    const rule =
      new AccountBalanceRule();


    const transaction = {
      amount: 300,
      type: "INCOME" as const,
      transactionDate: new Date("2026-08-20")
    };


    const result =
      rule.calculateAfterTransactionInput(
        1000,
        transaction,
        
      );


    expect(result)
      .toBe(1300);

  });


  it("deve aplicar despesa como débito", () => {

    const rule =
      new AccountBalanceRule();


    const transaction = {
      amount: 300,
      type: "EXPENSE" as const,
      transactionDate: new Date("2026-08-20")
    };


    const result =
      rule.calculateAfterTransactionInput(
        1000,
        transaction,
        
      );


    expect(result)
      .toBe(700);

  });


});