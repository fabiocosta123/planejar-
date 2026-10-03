import { describe, expect, it } from "vitest";

import { HistoryComparisonRule } from "../rules/history-comparison.rule";
import { HistoryTransaction } from "../rules/history-comparison.rule";

const rule = new HistoryComparisonRule();

function entry(
  amount: number,
  type: HistoryTransaction["type"],
  date: Date,
  status: HistoryTransaction["status"] = "COMPLETED"
): HistoryTransaction {
  return {
    amount,
    type,
    status,
    transactionDate: date,
  };
}

describe("HistoryComparisonRule", () => {
  const today = new Date(2026, 9, 3);

  it("compara o mês e o ano, ignorando cancelados", () => {
    const result = rule.compare(
      [
        entry(200, "INCOME", new Date(2026, 9, 1)),
        entry(80, "EXPENSE", new Date(2026, 9, 2)),
        entry(500, "EXPENSE", new Date(2026, 9, 2), "CANCELED"),
        entry(100, "INCOME", new Date(2026, 8, 10)),
        entry(40, "EXPENSE", new Date(2026, 8, 11)),
        entry(1000, "INCOME", new Date(2026, 0, 5)),
        entry(300, "INCOME", new Date(2025, 5, 1)),
        entry(120, "EXPENSE", new Date(2025, 5, 2)),
      ],
      today
    );

    expect(result.monthCurrent).toEqual({
      income: 200,
      expenses: 80,
    });
    expect(result.monthPrevious).toEqual({
      income: 100,
      expenses: 40,
    });
    expect(result.monthIncomeDifference).toBe(100);
    expect(result.monthExpenseDifference).toBe(40);
    expect(result.yearCurrent.income).toBe(1300);
    expect(result.yearPrevious).toEqual({
      income: 300,
      expenses: 120,
    });
    expect(result.yearIncomeDifference).toBe(1000);
  });
});
