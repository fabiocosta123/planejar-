import {
  describe,
  expect,
  it
} from "vitest";

import {
  AccountCurrentBalanceRule
} from "../rules/account-current-balance.rule";

import {
  TransactionInput
} from "../../financial/models/transaction-input";


describe("AccountCurrentBalanceRule", () => {

  const rule =
    new AccountCurrentBalanceRule();


  it("deve calcular o saldo atual considerando transações concluídas até a data de referência", () => {

    const referenceDate =
      new Date("2026-08-10");


    const transactions: TransactionInput[] = [

      {
        amount: 500,
        type: "INCOME",
        transactionDate:
          new Date("2026-08-05"),
        status: "COMPLETED"
      },

      {
        amount: 200,
        type: "EXPENSE",
        transactionDate:
          new Date("2026-08-08"),
        status: "COMPLETED"
      },

      {
        amount: 300,
        type: "EXPENSE",
        transactionDate:
          new Date("2026-08-15"),
        status: "COMPLETED"
      }

    ];


    const result =
      rule.calculate(
        1000,
        transactions,
        referenceDate
      );


    expect(result)
      .toBe(1300);

  });


  it("não deve considerar transações futuras", () => {

    const referenceDate =
      new Date("2026-08-10");


    const transactions: TransactionInput[] = [

      {
        amount: 500,
        type: "INCOME",
        transactionDate:
          new Date("2026-08-15"),
        status: "COMPLETED"
      },

      {
        amount: 300,
        type: "EXPENSE",
        transactionDate:
          new Date("2026-08-20"),
        status: "COMPLETED"
      }

    ];


    const result =
      rule.calculate(
        1000,
        transactions,
        referenceDate
      );


    expect(result)
      .toBe(1000);

  });


  it("não deve considerar transações pendentes ou canceladas", () => {

    const referenceDate =
      new Date("2026-08-10");


    const transactions: TransactionInput[] = [

      {
        amount: 500,
        type: "INCOME",
        transactionDate:
          new Date("2026-08-05"),
        status: "PENDING"
      },

      {
        amount: 200,
        type: "EXPENSE",
        transactionDate:
          new Date("2026-08-06"),
        status: "CANCELED"
      },

      {
        amount: 100,
        type: "EXPENSE",
        transactionDate:
          new Date("2026-08-07"),
        status: "COMPLETED"
      }

    ];


    const result =
      rule.calculate(
        1000,
        transactions,
        referenceDate
      );


    expect(result)
      .toBe(900);

  });


  it("deve permitir saldo negativo quando as despesas concluídas superam o saldo", () => {

    const referenceDate =
      new Date("2026-08-10");


    const transactions: TransactionInput[] = [

      {
        amount: 1500,
        type: "EXPENSE",
        transactionDate:
          new Date("2026-08-08"),
        status: "COMPLETED"
      }

    ];


    const result =
      rule.calculate(
        1000,
        transactions,
        referenceDate
      );


    expect(result)
      .toBe(-500);

  });

});