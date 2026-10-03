import { describe, expect, it } from "vitest";

import { parseCreateAccountInput } from "../parse-create-account";

describe("parseCreateAccountInput", () => {
  it("aceita saldo inicial zero", () => {
    const result = parseCreateAccountInput({
      name: " Carteira ",
      type: "CASH",
      initialBalance: "0,00",
      initialBalanceDate: "2026-10-03",
      useAsDefault: true,
    });

    expect(result).toEqual({
      ok: true,
      value: {
        name: "Carteira",
        type: "CASH",
        initialBalance: 0,
        initialBalanceDate: new Date(2026, 9, 3),
        useAsDefault: true,
      },
    });
  });

  it("recusa saldo negativo e tipo desconhecido", () => {
    expect(
      parseCreateAccountInput({
        name: "Conta",
        type: "CHECKING",
        initialBalance: "-1,00",
        initialBalanceDate: "2026-10-03",
      }).ok
    ).toBe(false);

    expect(
      parseCreateAccountInput({
        name: "Conta",
        type: "CREDIT",
        initialBalance: "10,00",
        initialBalanceDate: "2026-10-03",
      })
    ).toMatchObject({
      ok: false,
      message: "Escolha o tipo da conta.",
    });
  });
});
