import { describe, expect, it } from "vitest";
import { financialEngine } from "../engine/financial-engine";
import { TransactionInput } from "../models/transaction-input";


describe("FinancialEngine", () => {


  it("deve calcular resumo financeiro corretamente", () => {

    const transactions: TransactionInput[] = [

      {
        type: "INCOME",
        amount: 5000
      },

      {
        type: "EXPENSE",
        amount: 3000
      },

      {
        type: "EXPENSE",
        amount: 500
      }

    ];


    const result =
      financialEngine.calculateSummary(
        transactions
      );


    expect(result.income)
      .toBe(5000);


    expect(result.expenses)
      .toBe(3500);


    expect(result.balance)
      .toBe(1500);


    expect(result.hasPositiveBalance)
      .toBe(true);

  });



  it("deve identificar quando ultrapassa limite de gastos", () => {

    const transactions: TransactionInput[] = [

      {
        type: "INCOME",
        amount: 4000
      },

      {
        type: "EXPENSE",
        amount: 3500
      }

    ];


    const result =
      financialEngine.calculateSummary(
        transactions,
        3000
      );


    expect(result.limitExceeded)
      .toBe(true);

  });


});