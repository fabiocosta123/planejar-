import { describe, expect, it } from "vitest";

import { Account } from "../models/account";
import { AccountBalanceRule } from "../rules/account-balance.rule";


describe("Account + Transaction integration", () => {


  it("deve calcular o saldo após uma sequência de transações", () => {

    const account =
      new Account(
        "account-1",
        "Conta Corrente",
        "CHECKING",
        1000
      );


    const rule =
      new AccountBalanceRule();


    const income = {
      amount: 500,
      type: "INCOME" as const
    };


    const expense = {
      amount: 200,
      type: "EXPENSE" as const
    };


    const futureExpense = {
      amount: 1400,
      type: "EXPENSE" as const
    };


    const balanceAfterIncome =
      rule.calculateAfterTransactionInput(
        account.currentBalance,
        income
      );


    const balanceAfterExpense =
      rule.calculateAfterTransactionInput(
        balanceAfterIncome,
        expense
      );


    const finalBalance =
      rule.calculateAfterTransactionInput(
        balanceAfterExpense,
        futureExpense
      );


    expect(balanceAfterIncome)
      .toBe(1500);


    expect(balanceAfterExpense)
      .toBe(1300);


    expect(finalBalance)
      .toBe(-100);

  });


});