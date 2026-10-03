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
    const response = await authorizedFetch(config, "/api/pix", {
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

    const body = (await response.json().catch(() => null)) as Parameters<
      typeof readCreatedPix
    >[0] | null;

    const created = body ? readCreatedPix(body) : null;

    if (!response.ok || !created) {
      throw new MyCreditError("Não foi possível gerar o PIX.");
    }

    return created;
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
