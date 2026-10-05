import { readProCheckoutConfig, type ProCheckoutConfig } from "./config";
import {
  encodeIntegratorSecret,
  interpretPixLookup,
  readCreatedPix,
  type PixLookup,
} from "./pix";

export class MyCreditError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MyCreditError";
  }
}

let cachedToken: { value: string; expiresAt: number; apiBase: string } | null =
  null;

async function authorizedFetch(
  config: ProCheckoutConfig,
  path: string,
  init: RequestInit = {},
  allowRetry = true
): Promise<Response> {
  const token = await getToken(config);
  const response = await fetch(`${config.apiBase}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401 && allowRetry) {
    cachedToken = null;
    return authorizedFetch(config, path, init, false);
  }

  return response;
}

async function getToken(config: ProCheckoutConfig) {
  if (
    cachedToken &&
    cachedToken.apiBase === config.apiBase &&
    cachedToken.expiresAt > Date.now()
  ) {
    return cachedToken.value;
  }

  const secret = encodeIntegratorSecret(config.cnpj, config.integratorKey);
  const response = await fetch(
    `${config.apiBase}/api/token/${encodeURIComponent(secret)}`
  );

  if (!response.ok) {
    console.error("[mycredit] falha ao autenticar", { status: response.status });
    throw new MyCreditError("Não foi possível autenticar a cobrança.");
  }

  const body = (await response.json()) as { sucesso?: boolean; data?: unknown };

  if (body.sucesso !== true || typeof body.data !== "string" || !body.data) {
    throw new MyCreditError("Não foi possível autenticar a cobrança.");
  }

  cachedToken = {
    value: body.data,
    apiBase: config.apiBase,
    expiresAt: Date.now() + 36 * 60 * 60 * 1000,
  };

  return body.data;
}

export class MyCreditClient {
  constructor(
    private readonly config: () => ProCheckoutConfig = readProCheckoutConfig
  ) {}

  async createImmediatePix(input: { idFaturaPag: string; amount: number }) {
    const config = this.config();

    for (let attempt = 1; ; attempt++) {
      const outcome = await this.tryCreatePix(config, input);

      if (outcome.created) {
        return outcome.created;
      }

      console.error("[mycredit] falha ao gerar PIX", {
        attempt,
        status: outcome.status,
        detail: outcome.detail,
      });

      if (!outcome.retryable || attempt >= 2) {
        throw new MyCreditError("Não foi possível gerar o PIX.");
      }

      cachedToken = null;
    }
  }

  private async tryCreatePix(
    config: ProCheckoutConfig,
    input: { idFaturaPag: string; amount: number }
  ) {
    let response: Response;

    try {
      response = await authorizedFetch(config, "/api/pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formaPagamento: {
            tpTransacao: 11,
            idFaturaPag: input.idFaturaPag,
            modPagamento: 18,
            valorPagamento: Math.round(input.amount * 100) / 100,
          },
        }),
      });
    } catch (error) {
      if (error instanceof MyCreditError) {
        throw error;
      }

      return {
        created: null,
        status: null,
        detail: error instanceof Error ? error.message : "erro de rede",
        retryable: true,
      };
    }

    const text = await response.text().catch(() => "");
    let body: Parameters<typeof readCreatedPix>[0] | null = null;

    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = null;
    }

    const created = response.ok && body ? readCreatedPix(body) : null;

    return {
      created,
      status: response.status,
      detail: text.slice(0, 300),
      retryable:
        response.status >= 500 ||
        response.status === 401 ||
        response.status === 403,
    };
  }

  async getPixStatus(idFaturaPag: string): Promise<PixLookup> {
    const config = this.config();
    const response = await authorizedFetch(
      config,
      `/api/pix/${encodeURIComponent(idFaturaPag)}`
    );
    const body = (await response.json().catch(() => ({}))) as Parameters<
      typeof interpretPixLookup
    >[1];

    return interpretPixLookup(response.status, body);
  }

  async simulatePayment(idFaturaPag: string) {
    const config = this.config();
    const response = await authorizedFetch(
      config,
      `/api/pix/simular-pagamento/${encodeURIComponent(idFaturaPag)}`,
      { method: "POST" }
    );

    if (!response.ok) {
      throw new MyCreditError("Não foi possível simular o pagamento.");
    }
  }
}

export const myCreditClient = new MyCreditClient();
