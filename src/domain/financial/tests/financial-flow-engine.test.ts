import { describe, expect, it } from "vitest";

import {
  financialFlowEngine
} from "../engine/financial-flow-engine";

import {
  TransactionInput
} from "../models/transaction-input";


describe("FinancialFlowEngine", () => {


  it("deve calcular o saldo acumulado por data", () => {


    const transactions: TransactionInput[] = [

      {
        type: "EXPENSE",
        amount: 50,
        transactionDate:
          new Date("2026-08-06")
      },

      {
        type: "EXPENSE",
        amount: 60,
        transactionDate:
          new Date("2026-08-08")
      }

    ];


    const result =
      financialFlowEngine.calculate(
        100,
        transactions
      );


    expect(result)
      .toHaveLength(2);


    expect(result[0].date)
      .toEqual(
        new Date("2026-08-06")
      );


    expect(result[0].expenses)
      .toBe(50);


    expect(result[0].balance)
      .toBe(50);


    expect(result[1].date)
      .toEqual(
        new Date("2026-08-08")
      );


    expect(result[1].expenses)
      .toBe(60);


    expect(result[1].balance)
      .toBe(-10);


    expect(result[1].isNegative)
      .toBe(true);

  });


  it("deve agrupar transações do mesmo dia", () => {


    const transactions: TransactionInput[] = [

      {
        type: "INCOME",
        amount: 1000,
        transactionDate:
          new Date("2026-08-10T08:00:00")
      },

      {
        type: "INCOME",
        amount: 500,
        transactionDate:
          new Date("2026-08-10T12:00:00")
      },

      {
        type: "EXPENSE",
        amount: 300,
        transactionDate:
          new Date("2026-08-10T18:00:00")
      }

    ];


    const result =
      financialFlowEngine.calculate(
        1000,
        transactions
      );


    expect(result)
      .toHaveLength(1);


    expect(result[0].income)
      .toBe(1500);


    expect(result[0].expenses)
      .toBe(300);


    expect(result[0].balance)
      .toBe(2200);

  });


  it("deve ordenar transações que chegam fora de ordem", () => {


    const transactions: TransactionInput[] = [

      {
        type: "EXPENSE",
        amount: 100,
        transactionDate:
          new Date("2026-08-20")
      },

      {
        type: "INCOME",
        amount: 500,
        transactionDate:
          new Date("2026-08-10")
      }

    ];


    const result =
      financialFlowEngine.calculate(
        1000,
        transactions
      );


    expect(result[0].date)
      .toEqual(
        new Date("2026-08-10")
      );


    expect(result[0].balance)
      .toBe(1500);


    expect(result[1].date)
      .toEqual(
        new Date("2026-08-20")
      );


    expect(result[1].balance)
      .toBe(1400);

  });


  it("deve retornar fluxo vazio quando não existem transações", () => {


    const result =
      financialFlowEngine.calculate(
        1000,
        []
      );


    expect(result)
      .toHaveLength(0);

  });

});