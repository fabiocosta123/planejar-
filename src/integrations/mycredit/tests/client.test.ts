import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MyCreditClient, MyCreditError } from "../client";
import type { ProCheckoutConfig } from "../config";

const config: ProCheckoutConfig = {
  amount: 9.9,
  apiBase: "https://sandboxapi.mycredit.com.br",
  cnpj: "12345678000190",
  integratorKey: "chave",
  webhookToken: "",
  sandbox: true,
  configured: true,
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status });
}

const created = {
  sucesso: true,
  data: { retUrl: "000201-pix", expira: "2026-10-05T18:19:25-03:00" },
};

describe("MyCreditClient.createImmediatePix", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("tenta de novo com token novo quando a MyCredit falha no servidor", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url.includes("/api/token/")) {
        return json(200, { sucesso: true, data: "jwt" });
      }

      return fetchMock.mock.calls.filter(([u]) => String(u).endsWith("/api/pix")).length === 1
        ? json(502, { sucesso: false })
        : json(200, created);
    });

    const client = new MyCreditClient(() => ({ ...config, apiBase: "https://retry.test" }));
    const result = await client.createImmediatePix({ idFaturaPag: "fatura-1", amount: 9.9 });

    expect(result.copyPaste).toBe("000201-pix");
    expect(
      fetchMock.mock.calls.filter(([u]) => String(u).endsWith("/api/pix"))
    ).toHaveLength(2);
  });

  it("não repete quando a MyCredit recusa o pedido", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.includes("/api/token/")
        ? json(200, { sucesso: true, data: "jwt" })
        : json(400, { sucesso: false, mensagem: "Valor inválido" })
    );

    const client = new MyCreditClient(() => ({ ...config, apiBase: "https://refused.test" }));

    await expect(
      client.createImmediatePix({ idFaturaPag: "fatura-2", amount: 9.9 })
    ).rejects.toBeInstanceOf(MyCreditError);

    expect(
      fetchMock.mock.calls.filter(([u]) => String(u).endsWith("/api/pix"))
    ).toHaveLength(1);
    expect(console.error).toHaveBeenCalledWith(
      "[mycredit] falha ao gerar PIX",
      expect.objectContaining({ status: 400 })
    );
  });
});
