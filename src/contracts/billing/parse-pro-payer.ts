import { isValidTaxDocument, onlyDigits } from "../../domain/billing/tax-document";

export interface ProPayer {
  name: string;
  document: string;
}

export function parseProPayer(
  input: unknown
): { ok: true; value: ProPayer } | { ok: false; message: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, message: "Informe o nome e o CPF ou CNPJ." };
  }

  const data = input as { name?: unknown; document?: unknown };
  const name =
    typeof data.name === "string" ? data.name.trim().replace(/\s+/g, " ") : "";
  const document = typeof data.document === "string" ? onlyDigits(data.document) : "";

  if (name.length < 2 || name.length > 100) {
    return { ok: false, message: "Informe o nome de quem vai pagar." };
  }

  if (!isValidTaxDocument(document)) {
    return { ok: false, message: "Informe um CPF ou CNPJ válido." };
  }

  return { ok: true, value: { name, document } };
}
