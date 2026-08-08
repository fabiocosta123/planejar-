import { describe, expect, it, vi, beforeEach } from "vitest";

import { transactionsService } from "../transactions.service";
import { transactionsRepository } from "../../repositories/transactions.repository";
import { financialEngine } from "../../domain/financial/engine/financial-engine";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";
import { TransactionInput } from "../../domain/financial/models/transaction-input";

describe("TransactionsService", () => {


  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("deve calcular o saldo futuro através do FinancialEngine", async () => {

    const transactions: TransactionInput[] = [
      {
        amount: 1000,
        type: "INCOME",
        transactionDate: new Date("2026-08-10"),
        status: "COMPLETED"
      },
      {
        amount: 300,
        type: "EXPENSE",
        transactionDate: new Date("2026-08-15"),
        status: "COMPLETED"
      }
    ];

    vi.spyOn(
      transactionsRepository,
      "findByPeriod"
    ).mockResolvedValue(
      transactions
    );

    const result =
      await transactionsService.calculateFutureBalance(
        "family-member-id",
        new FinancialPeriod(
          new Date("2026-08-01"),
          new Date("2026-08-31")
        ),
        1000
      );

    expect(result.currentBalance)
      .toBe(1000);

    expect(result.futureIncome).toBe(1000);
    expect(result.futureExpenses).toBe(300);
    expect(result.futureBalance).toBe(1700);

  });

  it("deve calcular o fluxo financeiro através do FinancialFlowEngine", async () => {

    const transactions: TransactionInput[] = [
      {
        amount: 1000,
        type: "INCOME",
        transactionDate: new Date("2026-08-10"),
        status: "COMPLETED"
      },
      {
        amount: 500,
        type: "EXPENSE",
        transactionDate: new Date("2026-08-15"),
        status: "COMPLETED"
      }
    ];

    vi.spyOn(
      transactionsRepository,
      "findByPeriod"
    ).mockResolvedValue(
      transactions,

    );

    const result =
      await transactionsService.calculateFinancialFlow(
        "family-member-id",
        new FinancialPeriod(
          new Date("2026-08-01"),
          new Date("2026-08-31")
        ),
        1000
      );

    expect(result)
      .toHaveLength(2);

    expect(result[0].date)
      .toEqual(new Date("2026-08-10"));

    expect(result[0].income)
      .toBe(1000);

    expect(result[0].expenses)
      .toBe(0);

    expect(result[0].balance)
      .toBe(2000);

    expect(result[1].date)
      .toEqual(new Date("2026-08-15"));

    expect(result[1].income)
      .toBe(0);

    expect(result[1].expenses)
      .toBe(500);

    expect(result[1].balance)
      .toBe(1500);

  });





  it("deve calcular resumo financeiro das transações do período", async () => {


    const transactions = [
      {
        id: "1",
        description: "Salário",
        amount: 5000,
        type: "INCOME",
        transactionDate: new Date("2026-08-10"),
        status: "COMPLETED"
      },
      {
        id: "2",
        description: "Mercado",
        amount: 1000,
        type: "EXPENSE",
        transactionDate: new Date("2026-08-15"),
        status: "COMPLETED"
      }
    ];



    vi.spyOn(
      transactionsRepository,
      "findByPeriod"
    )
      .mockResolvedValue(
        transactions as any
      );



    const engineSpy =
      vi.spyOn(
        financialEngine,
        "calculateSummary"
      )
        .mockReturnValue({
          income: 5000,
          expenses: 1000,
          balance: 4000,
          limitExceeded: false
        } as any);



    const period =
      new FinancialPeriod(
        new Date("2026-08-01"),
        new Date("2026-08-31")
      );



    const result =
      await transactionsService.calculateSummary(
        "family-member-id",
        period
      );



    expect(
      transactionsRepository.findByPeriod
    )
      .toHaveBeenCalledWith(
        "family-member-id",
        period
      );



    expect(
      engineSpy
    )
      .toHaveBeenCalled();



    expect(result.balance)
      .toBe(4000);


  });


});