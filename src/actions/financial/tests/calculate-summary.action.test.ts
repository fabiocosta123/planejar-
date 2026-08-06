import { describe, expect, it, vi } from "vitest";
import { calculateFinancialSummaryAction } from "../calculate-summary.actions";
import { transactionsService } from "../../../services/transactions.service";


describe("calculateFinancialSummaryAction", () => {


  it("deve calcular resumo financeiro do período", async () => {


    const summary = {
      income: 5000,
      expenses: 2000,
      balance: 3000,
      limitExceeded: false
    };


    const spy =
      vi.spyOn(
        transactionsService,
        "calculateSummary"
      )
      .mockResolvedValue(summary as any);



    const result =
      await calculateFinancialSummaryAction(
        "family-member-id",
        new Date("2026-08-01"),
        new Date("2026-08-31")
      );



    expect(spy)
      .toHaveBeenCalled();



    expect(result.balance)
      .toBe(3000);



    expect(result.income)
      .toBe(5000);


  });


});