import { describe, expect, it } from "vitest";

import {
  parseCreateTransactionInput,
  parseUpdateSeriesInput,
} from "../parse-create-transaction";

const validInput = {
  accountId: "account-1",
  description: " Mercado ",
  amount: "1.234,56",
  type: "EXPENSE",
  transactionDate: "2026-08-20",
  notes: "  ",
};

describe("parseCreateTransactionInput", () => {
  it("deve aceitar valor em reais", () => {
    const result = parseCreateTransactionInput(validInput);

    expect(result).toEqual({
      ok: true,
      value: {
        accountId: "account-1",
        description: "Mercado",
        amount: 1234.56,
        type: "EXPENSE",
        transactionDate: new Date(2026, 7, 20),
        notes: undefined,
        repeatsMonthly: false,
      },
    });
  });

  it("deve recusar valor zero ou negativo", () => {
    expect(
      parseCreateTransactionInput({
        ...validInput,
        amount: "0,00",
      })
    ).toMatchObject({
      ok: false,
    });

    expect(
      parseCreateTransactionInput({
        ...validInput,
        amount: -10,
      })
    ).toMatchObject({
      ok: false,
    });
  });

  it("deve aceitar repetição mensal", () => {
    const result = parseCreateTransactionInput({
      ...validInput,
      repeatsMonthly: true,
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        repeatsMonthly: true,
      },
    });
  });

  it("deve recusar repetição inválida", () => {
    const result = parseCreateTransactionInput({
      ...validInput,
      repeatsMonthly: "mensal",
    });

    expect(result).toMatchObject({
      ok: false,
      message: "Não foi possível ler a repetição.",
    });
  });

  it("deve aceitar a alteração da repetição", () => {
    const result = parseUpdateSeriesInput({
      id: "series-1",
      accountId: "account-1",
      description: " Aluguel ",
      amount: "800,00",
      type: "EXPENSE",
      dayOfMonth: "10",
    });

    expect(result).toEqual({
      ok: true,
      value: {
        id: "series-1",
        accountId: "account-1",
        description: "Aluguel",
        amount: 800,
        type: "EXPENSE",
        dayOfMonth: 10,
      },
    });
  });

  it("deve recusar dia fora do mês", () => {
    const result = parseUpdateSeriesInput({
      id: "series-1",
      accountId: "account-1",
      description: "Aluguel",
      amount: "10,00",
      type: "EXPENSE",
      dayOfMonth: "32",
    });

    expect(result).toMatchObject({
      ok: false,
      message: "Informe um dia entre 1 e 31.",
    });
  });

  it("deve recusar data inválida", () => {
    const result = parseCreateTransactionInput({
      ...validInput,
      transactionDate: "2026-02-31",
    });

    expect(result).toMatchObject({
      ok: false,
      message: "Informe uma data válida.",
    });
  });
});
