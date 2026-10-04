import { describe, expect, it } from "vitest";

import {
  encodeIntegratorSecret,
  interpretPixLookup,
  parseMyCreditWebhook,
  readCreatedPix,
} from "../pix";

describe("encodeIntegratorSecret", () => {
  it("monta o segredo no formato da MyCredit", () => {
    expect(encodeIntegratorSecret("99999999999999", "CHAVE123456789")).toBe(
      "OTk5OTk5OTk5OTk5OTl8Q0hBVkUxMjM0NTY3ODk="
    );
  });
});

describe("interpretPixLookup", () => {
  it("trata 200 como pago e 410 como pendente", () => {
    expect(
      interpretPixLookup(200, {
        sucesso: true,
        data: { response: { vLanc: 19.9 } },
      })
    ).toEqual({ status: "paid", amount: 19.9 });

    expect(interpretPixLookup(410, { sucesso: false })).toEqual({
      status: "pending",
    });
  });
});

describe("readCreatedPix", () => {
  it("lê o copia e cola", () => {
    const created = readCreatedPix({
      sucesso: true,
      data: {
        retUrl: "000201",
        expira: "2026-10-03T21:00:00.000Z",
      },
    });

    expect(created?.copyPaste).toBe("000201");
    expect(created?.expiresAt.toISOString()).toBe("2026-10-03T21:00:00.000Z");
  });
});

describe("parseMyCreditWebhook", () => {
  it("aceita pix.pago e recusa corpo incompleto", () => {
    expect(
      parseMyCreditWebhook({
        id: "event-1",
        tipo: "pix.pago",
        dados: {
          pagamento: {
            idFaturaPag: "fatura-1",
            valor: 19.9,
          },
        },
      })
    ).toEqual({
      id: "event-1",
      tipo: "pix.pago",
      idFaturaPag: "fatura-1",
      valor: 19.9,
    });

    expect(parseMyCreditWebhook({ tipo: "pix.pago" })).toBeNull();
  });
});
