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

const payer = { name: "Fábio Costa", document: "52998224725" };

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
    const result = await client.createImmediatePix({ idFaturaPag: "fatura-1", amount: 9.9, payer });

    expect(result.copyPaste).toBe("000201-pix");
    expect(
      fetchMock.mock.calls.filter(([u]) => String(u).endsWith("/api/pix"))
    ).toHaveLength(2);
  });

  it("envia nome e documento do pagador", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.includes("/api/token/")
        ? json(200, { sucesso: true, data: "jwt" })
        : json(200, created)
    );

    const client = new MyCreditClient(() => ({ ...config, apiBase: "https://payer.test" }));
    await client.createImmediatePix({ idFaturaPag: "fatura-5", amount: 9.9, payer });

    const [, init] = fetchMock.mock.calls.find(([u]) => String(u).endsWith("/api/pix"))!;
    expect(JSON.parse(String(init.body))).toMatchObject({
      formaPagamento: { qtdParcelas: 1, valorPagamento: 9.9 },
      cliente: { xNome: "Fábio Costa", documento: "52998224725" },
    });
  });

  it("tenta de novo quando a MyCredit avisa erro temporário", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url.includes("/api/token/")) {
        return json(200, { sucesso: true, data: "jwt" });
      }

      return fetchMock.mock.calls.filter(([u]) => String(u).endsWith("/api/pix")).length === 1
        ? json(400, {
            sucesso: false,
            errors: "A Fiserv retornou um erro temporário. Tente novamente em instantes.",
          })
        : json(200, created);
    });

    const client = new MyCreditClient(() => ({ ...config, apiBase: "https://temporary.test" }));
    const result = await client.createImmediatePix({ idFaturaPag: "fatura-6", amount: 9.9, payer });

    expect(result.copyPaste).toBe("000201-pix");
  });

  it("não repete quando a MyCredit recusa o pedido", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.includes("/api/token/")
        ? json(200, { sucesso: true, data: "jwt" })
        : json(400, { sucesso: false, mensagem: "Valor inválido" })
    );

    const client = new MyCreditClient(() => ({ ...config, apiBase: "https://refused.test" }));

    await expect(
      client.createImmediatePix({ idFaturaPag: "fatura-2", amount: 9.9, payer })
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

describe("MyCreditClient.simulatePayment", () => {
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

  it("envia corpo JSON, exigido pela MyCredit", async () => {
    fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
      if (url.includes("/api/token/")) {
        return json(200, { sucesso: true, data: "jwt" });
      }

      const headers = new Headers(init?.headers);
      return headers.get("Content-Type") === "application/json" && init?.body
        ? json(200, { sucesso: true })
        : json(415, { title: "Unsupported Media Type" });
    });

    const client = new MyCreditClient(() => ({ ...config, apiBase: "https://simulate.test" }));

    await expect(client.simulatePayment("fatura-3")).resolves.toBeUndefined();
  });

  it("registra o status quando a simulação falha", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.includes("/api/token/")
        ? json(200, { sucesso: true, data: "jwt" })
        : json(404, { sucesso: false })
    );

    const client = new MyCreditClient(() => ({ ...config, apiBase: "https://simulate-fail.test" }));

    await expect(client.simulatePayment("fatura-4")).rejects.toBeInstanceOf(MyCreditError);
    expect(console.error).toHaveBeenCalledWith(
      "[mycredit] falha ao simular pagamento",
      expect.objectContaining({ status: 404 })
    );
  });
});
