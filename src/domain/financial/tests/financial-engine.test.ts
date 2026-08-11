import { describe, expect, it } from "vitest";
import { financialEngine } from "../engine/financial-engine";
import { TransactionInput } from "../models/transaction-input";


describe("FinancialEngine", () => {

  it(
    "deve calcular o saldo atual de uma conta",
    () => {

      const result =
        financialEngine.calculateCurrentBalance(
          1000,
          [
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
                new Date("2026-08-06"),
              status: "COMPLETED"
            },
            {
              amount: 300,
              type: "EXPENSE",
              transactionDate:
                new Date("2026-08-15"),
              status: "COMPLETED"
            }
          ],
          new Date("2026-08-10")
        );


      expect(result)
        .toBe(1300);

    }
  );


  it("deve calcular resumo financeiro corretamente", () => {

    const transactions: TransactionInput[] = [

      {
        type: "INCOME",
        amount: 5000,
        transactionDate: new Date("2026-08-10"),
        status: "COMPLETED"
      },

      {
        type: "EXPENSE",
        amount: 3000,
        transactionDate: new Date("2026-08-15"),
        status: "COMPLETED"
      },

      {
        type: "EXPENSE",
        amount: 500,
        transactionDate: new Date("2026-08-20"),
        status: "PENDING"
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

  it("não deve considerar como futura uma transação na data de referência", () => {

    const transactions: TransactionInput[] = [

      {
        type: "INCOME",
        amount: 500,
        transactionDate: new Date("2026-08-07"),
        status: "COMPLETED"
      },

      {
        type: "EXPENSE",
        amount: 300,
        transactionDate: new Date("2026-08-10"),
        status: "PENDING"
      }

    ];


    const result =
      financialEngine.calculateFutureBalance(
        1000,
        transactions,
        new Date("2026-08-07")
      );


    expect(result.futureIncome)
      .toBe(0);


    expect(result.futureExpenses)
      .toBe(300);


    expect(result.futureBalance)
      .toBe(700);

  });

  it("deve calcular o saldo futuro considerando apenas transações futuras", () => {

    const transactions: TransactionInput[] = [

      {
        type: "INCOME",
        amount: 500,
        transactionDate: new Date("2026-08-05"),
        status: "COMPLETED"
      },

      {
        type: "INCOME",
        amount: 1000,
        transactionDate: new Date("2026-08-10"),
        status: "PENDING"
      },

      {
        type: "EXPENSE",
        amount: 300,
        transactionDate: new Date("2026-08-15"),
        status: "PENDING"
      },

      {
        type: "EXPENSE",
        amount: 200,
        transactionDate: new Date("2026-08-20"),
        status: "PENDING"
      }

    ];


    const result =
      financialEngine.calculateFutureBalance(
        2000,
        transactions,
        new Date("2026-08-07")
      );


    expect(result.currentBalance)
      .toBe(2000);


    expect(result.futureIncome)
      .toBe(1000);


    expect(result.futureExpenses)
      .toBe(500);


    expect(result.futureBalance)
      .toBe(2500);

  });



  it("deve identificar quando ultrapassa limite de gastos", () => {

    const transactions: TransactionInput[] = [

      {
        type: "INCOME",
        amount: 4000,
        transactionDate: new Date("2026-08-10"),
        status: "COMPLETED"
      },

      {
        type: "EXPENSE",
        amount: 3500,
        transactionDate: new Date("2026-08-15"),
        status: "PENDING"
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