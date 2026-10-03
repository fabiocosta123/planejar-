import { describe, expect, it } from "vitest";

import { parseCreateTransactionInput } from "../parse-create-transaction";

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
