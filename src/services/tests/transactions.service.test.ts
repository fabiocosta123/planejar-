import { describe, expect, it, vi, beforeEach } from "vitest";

import { transactionsService } from "../transactions.service";
import { transactionsRepository } from "../../repositories/transactions.repository";
import { financialEngine } from "../../domain/financial/engine/financial-engine";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";


describe("TransactionsService", () => {


  beforeEach(() => {
    vi.restoreAllMocks();
  });



  it("deve calcular resumo financeiro das transações do período", async () => {


    const transactions = [
      {
        id: "1",
        description: "Salário",
        amount: 5000,
        type: "INCOME"
      },
      {
        id: "2",
        description: "Mercado",
        amount: 1000,
        type: "EXPENSE"
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