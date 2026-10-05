import { describe, expect, it } from "vitest";

import {
  formatTaxDocument,
  isValidCnpj,
  isValidCpf,
  isValidTaxDocument,
} from "../tax-document";

describe("documento do pagador", () => {
  it("aceita CPF com dígitos certos, com ou sem pontuação", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
    expect(isValidCpf("52998224725")).toBe(true);
  });

  it("recusa CPF com dígito errado ou repetido", () => {
    expect(isValidCpf("529.982.247-24")).toBe(false);
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCpf("1234")).toBe(false);
  });

  it("aceita CNPJ com dígitos certos", () => {
    expect(isValidCnpj("11.222.333/0001-81")).toBe(true);
    expect(isValidCnpj("11.222.333/0001-80")).toBe(false);
  });

  it("aceita CPF ou CNPJ", () => {
    expect(isValidTaxDocument("52998224725")).toBe(true);
    expect(isValidTaxDocument("11222333000181")).toBe(true);
    expect(isValidTaxDocument("00000000000")).toBe(false);
  });

  it("formata enquanto digita", () => {
    expect(formatTaxDocument("52998224725")).toBe("529.982.247-25");
    expect(formatTaxDocument("5299")).toBe("529.9");
    expect(formatTaxDocument("11222333000181")).toBe("11.222.333/0001-81");
  });
});
