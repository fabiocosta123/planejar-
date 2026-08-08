import { describe, expect, it, vi, beforeEach } from "vitest";

import { calculateFinancialSummaryAction } from "../calculate-summary.actions";
import { transactionsRepository } from "../../../repositories/transactions.repository";


vi.mock("../../../repositories/transactions.repository", () => ({
  transactionsRepository: {
    findByPeriod: vi.fn(),
  },
}));


describe("CalculateFinancialSummaryAction - Integration", () => {

  beforeEach(() => {

    vi.clearAllMocks();

  });


  it("deve calcular o resumo financeiro completo através da action", async () => {

    vi.mocked(
      transactionsRepository.findByPeriod
    ).mockResolvedValue([

      {
        type: "INCOME",
        amount: 5000,
        transactionDate: new Date("2026-08-15"),
        status: "COMPLETED"
      },

      {
        type: "EXPENSE",
        amount: 2000,
        transactionDate: new Date("2026-08-20"),
        status: "PENDING"
      },

      {
        type: "EXPENSE",
        amount: 500,
        transactionDate: new Date("2026-08-25"),
        status: "PENDING"
      },

    ]);


    const result =
      await calculateFinancialSummaryAction(
        "family-member-1",
        new Date("2026-08-01"),
        new Date("2026-08-31")
      );


    expect(result.income)
      .toBe(5000);


    expect(result.expenses)
      .toBe(2500);


    expect(result.balance)
      .toBe(2500);


    


    expect(
      transactionsRepository.findByPeriod
    ).toHaveBeenCalledTimes(1);


    expect(
      transactionsRepository.findByPeriod
    ).toHaveBeenCalledWith(

      "family-member-1",

      expect.objectContaining({

        startDate:
          new Date("2026-08-01"),

        endDate:
          new Date("2026-08-31"),

      })

    );

  });



  it("deve identificar saldo negativo através da integração", async () => {

    vi.mocked(
      transactionsRepository.findByPeriod
    ).mockResolvedValue([

      {
        type: "INCOME",
        amount: 2000,
        transactionDate: new Date("2026-08-15"),
        status: "COMPLETED"
      },

      {
        type: "EXPENSE",
        amount: 3000,
        transactionDate: new Date("2026-08-20"),
        status: "PENDING"
      },

    ]);


    const result =
      await calculateFinancialSummaryAction(
        "family-member-1",
        new Date("2026-08-01"),
        new Date("2026-08-31")
      );


    expect(result.income)
      .toBe(2000);


    expect(result.expenses)
      .toBe(3000);


    expect(result.balance)
      .toBe(-1000);


    

  });



  it("deve respeitar o limite de gastos", async () => {

    vi.mocked(
      transactionsRepository.findByPeriod
    ).mockResolvedValue([

      {
        type: "INCOME",
        amount: 5000,
        transactionDate: new Date("2026-08-15"),
        status: "COMPLETED"
      },

      {
        type: "EXPENSE",
        amount: 3500,
        transactionDate: new Date("2026-08-20"),
        status: "PENDING"
      },

    ]);


    const result =
      await calculateFinancialSummaryAction(
        "family-member-1",
        new Date("2026-08-01"),
        new Date("2026-08-31"),
        3000
      );


    expect(result.income)
      .toBe(5000);


    expect(result.expenses)
      .toBe(3500);


    expect(result.balance)
      .toBe(1500);


    expect(result.limitExceeded)
      .toBe(true);

  });

});