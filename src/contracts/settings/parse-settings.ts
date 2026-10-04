const LEVELS = ["NONE", "IMPORTANT", "ALL"] as const;

export type NoticePreference = (typeof LEVELS)[number];

export interface ParsedSettings {
  minimumReserve: number;
  dayOfTightnessAlert: boolean;
  notificationLevel: NoticePreference;
}

export type ParseSettingsResult =
  | { ok: true; value: ParsedSettings }
  | { ok: false; message: string };

const MAX_AMOUNT = 9_999_999_999.99;

export function parseSettingsInput(input: unknown): ParseSettingsResult {
  if (!input || typeof input !== "object") {
    return { ok: false, message: "Não foi possível ler as configurações." };
  }

  const data = input as Record<string, unknown>;
  const minimumReserve = readReserve(data.minimumReserve);

  if (typeof minimumReserve !== "number") {
    return minimumReserve;
  }

  if (typeof data.dayOfTightnessAlert !== "boolean") {
    return { ok: false, message: "Informe se o dia do aperto fica visível." };
  }

  const notificationLevel = readLevel(data.notificationLevel);

  if (typeof notificationLevel !== "string") {
    return notificationLevel;
  }

  return {
    ok: true,
    value: {
      minimumReserve,
      dayOfTightnessAlert: data.dayOfTightnessAlert,
      notificationLevel,
    },
  };
}

function readLevel(
  value: unknown
): NoticePreference | ParseSettingsResult {
  if (typeof value === "string" && LEVELS.includes(value as NoticePreference)) {
    return value as NoticePreference;
  }

  return { ok: false, message: "Escolha o nível dos avisos." };
}

function readReserve(value: unknown): number | ParseSettingsResult {
  const amount = parseReserve(value);

  if (amount === null) {
    return {
      ok: false,
      message: "Informe uma reserva igual ou maior que zero.",
    };
  }

  return amount;
}

function parseReserve(value: unknown): number | null {
  if (typeof value === "number") {
    return normalize(value);
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().replace(/\s/g, "").replace(/^R\$/i, "");

  if (!trimmed) {
    return null;
  }

  let normalized = trimmed;

  if (trimmed.includes(",")) {
    if (
      !/^\d{1,3}(\.\d{3})*,\d{1,2}$/.test(trimmed) &&
      !/^\d+,\d{1,2}$/.test(trimmed)
    ) {
      return null;
    }

    normalized = trimmed.replace(/\./g, "").replace(",", ".");
  } else if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return null;
  }

  return normalize(Number(normalized));
}

function normalize(amount: number): number | null {
  if (!Number.isFinite(amount) || amount < 0 || amount > MAX_AMOUNT) {
    return null;
  }

  const cents = Math.round(amount * 100);

  if (Math.abs(amount * 100 - cents) > 0.001) {
    return null;
  }

  return cents / 100;
}
