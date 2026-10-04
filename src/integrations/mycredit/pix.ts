export function encodeIntegratorSecret(cnpj: string, integratorKey: string) {
  return Buffer.from(`${cnpj}|${integratorKey}`, "utf8").toString("base64");
}

export type PixLookup =
  | { status: "paid"; amount: number | null }
  | { status: "pending" }
  | { status: "missing" }
  | { status: "error" };

interface PixStatusBody {
  sucesso?: boolean;
  data?: {
    response?: {
      vLanc?: number;
    };
  };
}

export function interpretPixLookup(
  status: number,
  body: PixStatusBody
): PixLookup {
  if (status === 200 && body.sucesso === true) {
    const amount = body.data?.response?.vLanc;
    return {
      status: "paid",
      amount: typeof amount === "number" ? amount : null,
    };
  }

  if (status === 410) {
    return { status: "pending" };
  }

  if (status === 404) {
    return { status: "missing" };
  }

  return { status: "error" };
}

interface CreatedPixBody {
  sucesso?: boolean;
  data?: {
    retUrl?: string;
    expira?: string;
  };
}

export function readCreatedPix(body: CreatedPixBody, now = new Date()) {
  const copyPaste = body.data?.retUrl;

  if (body.sucesso !== true || !copyPaste) {
    return null;
  }

  const parsedExpiry = body.data?.expira
    ? new Date(body.data.expira)
    : new Date(now.getTime() + 10 * 60 * 1000);

  const expiresAt = Number.isNaN(parsedExpiry.getTime())
    ? new Date(now.getTime() + 10 * 60 * 1000)
    : parsedExpiry;

  return { copyPaste, expiresAt };
}

export interface MyCreditWebhookEvent {
  id: string;
  tipo: "pix.pago" | "pix.estornado";
  idFaturaPag: string;
  valor: number;
}

export function parseMyCreditWebhook(body: unknown): MyCreditWebhookEvent | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const event = body as {
    id?: unknown;
    tipo?: unknown;
    dados?: {
      pagamento?: {
        idFaturaPag?: unknown;
        valor?: unknown;
      };
    };
  };

  const id = event.id;
  const tipo = event.tipo;
  const idFaturaPag = event.dados?.pagamento?.idFaturaPag;
  const valor = event.dados?.pagamento?.valor;

  if (typeof id !== "string" || id.length === 0) {
    return null;
  }

  if (tipo !== "pix.pago" && tipo !== "pix.estornado") {
    return null;
  }

  if (typeof idFaturaPag !== "string" || idFaturaPag.length === 0) {
    return null;
  }

  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    return null;
  }

  return { id, tipo, idFaturaPag, valor };
}
