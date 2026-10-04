import { describe, expect, it } from "vitest";

import { TightDayRule } from "../rules/tight-day.rule";
import { TransactionInput } from "../models/transaction-input";

const rule = new TightDayRule();

function expense(
  amount: number,
  day: number,
  status: TransactionInput["status"] = "COMPLETED"
): TransactionInput {
  return {
    amount,
    type: "EXPENSE",
    status,
    transactionDate: new Date(2026, 9, day),
  };
}

describe("TightDayRule", () => {
  const today = new Date(2026, 9, 3);

  it("não aponta aperto quando o saldo permanece na reserva", () => {
    const result = rule.calculate(
      500,
      [expense(100, 10)],
      today,
      0
    );

    expect(result).toBeNull();
  });

  it("aponta hoje quando o saldo já está abaixo da reserva", () => {
    const result = rule.calculate(
      20,
      [],
      today,
      50
    );

    expect(result?.date).toEqual(new Date(2026, 9, 3));
    expect(result?.shortfall).toBe(30);
    expect(result?.daysRemaining).toBe(1);
    expect(result?.dailyAmount).toBe(30);
  });

  it("divide o buraco pelos dias até o primeiro dia abaixo da reserva", () => {
    const result = rule.calculate(
      100,
      [
        expense(40, 10),
        expense(80, 20),
      ],
      today,
      0
    );

    expect(result?.date).toEqual(new Date(2026, 9, 20));
    expect(result?.balance).toBe(-20);
    expect(result?.shortfall).toBe(20);
    expect(result?.daysRemaining).toBe(17);
    expect(result?.dailyAmount).toBe(1.18);
  });

  it("ignora lançamento cancelado", () => {
    const result = rule.calculate(
      100,
      [expense(500, 15, "CANCELED")],
      today,
      0
    );

    expect(result).toBeNull();
  });

  it("considera lançamento pendente no futuro", () => {
    const result = rule.calculate(
      100,
      [expense(150, 8, "PENDING")],
      today,
      0
    );

    expect(result?.date).toEqual(new Date(2026, 9, 8));
    expect(result?.shortfall).toBe(50);
    expect(result?.daysRemaining).toBe(5);
    expect(result?.dailyAmount).toBe(10);
  });
});
