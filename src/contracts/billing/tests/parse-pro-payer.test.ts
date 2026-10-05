import { describe, expect, it } from "vitest";

import { parseProPayer } from "../parse-pro-payer";

describe("parseProPayer", () => {
  it("guarda o documento só com números", () => {
    expect(
      parseProPayer({ name: "  Fábio   Costa ", document: "529.982.247-25" })
    ).toEqual({ ok: true, value: { name: "Fábio Costa", document: "52998224725" } });
  });

  it("pede o nome", () => {
    expect(parseProPayer({ name: " ", document: "52998224725" })).toEqual({
      ok: false,
      message: "Informe o nome de quem vai pagar.",
    });
  });

  it("recusa documento inválido", () => {
    expect(parseProPayer({ name: "Fábio", document: "123.456.789-00" })).toEqual({
      ok: false,
      message: "Informe um CPF ou CNPJ válido.",
    });
  });
});
