import { describe, expect, it } from "vitest";

import { FutureTransactionRule } from "../rules/future-transaction.rule";
import { TransactionInput } from "../models/transaction-input";


describe("FutureTransactionRule", () => {

  const rule =
    new FutureTransactionRule();


  it("deve identificar uma transação futura", () => {

    const transaction: TransactionInput = {

      type: "EXPENSE",

      amount: 500,

      transactionDate:
        new Date("2026-08-10"),
        status: "COMPLETED" as const

    };


    const result =
      rule.isFuture(
        transaction,
        new Date("2026-08-07")
      );


    expect(result)
      .toBe(true);

  });


  it("não deve considerar a transação da data de referência como futura", () => {

    const transaction: TransactionInput = {

      type: "EXPENSE",

      amount: 500,

      transactionDate:
        new Date("2026-08-07"),
      status: "COMPLETED" as const

    };


    const result =
      rule.isFuture(
        transaction,
        new Date("2026-08-07")
      );


    expect(result)
      .toBe(false);

  });


  it("não deve considerar uma transação anterior como futura", () => {

    const transaction: TransactionInput = {

      type: "INCOME",

      amount: 1000,

      transactionDate:
        new Date("2026-08-05"),
      status: "COMPLETED" as const

    };


    const result =
      rule.isFuture(
        transaction,
        new Date("2026-08-07")
      );


    expect(result)
      .toBe(false);

  });


  it("deve filtrar somente as transações futuras", () => {

    const transactions: TransactionInput[] = [

      {
        type: "INCOME",
        amount: 1000,
        transactionDate:
          new Date("2026-08-05"),
        status: "COMPLETED" as const
      },

      {
        type: "EXPENSE",
        amount: 300,
        transactionDate:
          new Date("2026-08-07"),
        status: "COMPLETED" as const
      },

      {
        type: "EXPENSE",
        amount: 500,
        transactionDate:
          new Date("2026-08-10"),
        status: "COMPLETED" as const
      },

      {
        type: "EXPENSE",
        amount: 200,
        transactionDate:
          new Date("2026-08-20"),
        status: "COMPLETED" as const
      }

    ];


    const result =
      rule.filterFuture(
        transactions,
        new Date("2026-08-07")
      );


    expect(result)
      .toHaveLength(2);


    expect(result[0].amount)
      .toBe(500);


    expect(result[1].amount)
      .toBe(200);

  });

});