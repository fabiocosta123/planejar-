const MAX_AMOUNT = 9_999_999_999.99;
const MIN_YEAR = 2000;
const MAX_YEAR = 2100;

export interface ParsedCreateTransaction {
  accountId: string;
  description: string;
  notes?: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  transactionDate: Date;
  repeatsMonthly: boolean;
}

type ParseFailure = { ok: false; message: string };

export type ParseCreateTransactionResult =
  | { ok: true; value: ParsedCreateTransaction }
  | ParseFailure;

export function parseCreateTransactionInput(
  input: unknown
): ParseCreateTransactionResult {
  if (!input || typeof input !== "object") {
    return {
      ok: false,
      message: "Não foi possível ler o lançamento.",
    };
  }

  const data = input as Record<string, unknown>;

  const description = readDescription(data.description);

  if (typeof description !== "string") {
    return description;
  }

  const amount = readAmount(data.amount);

  if (typeof amount !== "number") {
    return amount;
  }

  const type = readType(data.type);

  if (type !== "INCOME" && type !== "EXPENSE") {
    return type;
  }

  const accountId = readAccountId(data.accountId);

  if (typeof accountId !== "string") {
    return accountId;
  }

  const transactionDate = readDate(data.transactionDate);

  if (!(transactionDate instanceof Date)) {
    return transactionDate;
  }

  const notes = readNotes(data.notes);

  if (notes && typeof notes !== "string") {
    return notes;
  }

  const repeatsMonthly = readRepeatsMonthly(data.repeatsMonthly);

  if (typeof repeatsMonthly !== "boolean") {
    return repeatsMonthly;
  }

  return {
    ok: true,
    value: {
      accountId,
      description,
      notes: notes || undefined,
      amount,
      type,
      transactionDate,
      repeatsMonthly,
    },
  };
}

function readDescription(
  value: unknown
): string | ParseFailure {
  if (typeof value !== "string" || !value.trim()) {
    return {
      ok: false,
      message: "Informe uma descrição.",
    };
  }

  const description = value.trim();

  if (description.length > 120) {
    return {
      ok: false,
      message: "A descrição pode ter no máximo 120 caracteres.",
    };
  }

  return description;
}

function readAmount(
  value: unknown
): number | ParseFailure {
  const amount = parseAmount(value);

  if (amount === null) {
    return {
      ok: false,
      message: "Informe um valor maior que zero.",
    };
  }

  return amount;
}

function readType(
  value: unknown
): "INCOME" | "EXPENSE" | ParseFailure {
  if (value === "INCOME" || value === "EXPENSE") {
    return value;
  }

  return {
    ok: false,
    message: "Escolha se o lançamento é entrada ou saída.",
  };
}

function readAccountId(
  value: unknown
): string | ParseFailure {
  if (typeof value !== "string" || !value.trim() || value.trim().length > 64) {
    return {
      ok: false,
      message: "Escolha uma conta.",
    };
  }

  return value.trim();
}

function readDate(
  value: unknown
): Date | ParseFailure {
  if (typeof value !== "string") {
    return {
      ok: false,
      message: "Informe uma data válida.",
    };
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return {
      ok: false,
      message: "Informe uma data válida.",
    };
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    year < MIN_YEAR ||
    year > MAX_YEAR ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return {
      ok: false,
      message: "Informe uma data válida.",
    };
  }

  return date;
}

export interface ParsedUpdateSeries {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  dayOfMonth: number;
}

export type ParseUpdateSeriesResult =
  | { ok: true; value: ParsedUpdateSeries }
  | { ok: false; message: string };

export function parseUpdateSeriesInput(
  input: unknown
): ParseUpdateSeriesResult {
  if (!input || typeof input !== "object") {
    return {
      ok: false,
      message: "Não foi possível ler a repetição.",
    };
  }

  const data = input as Record<string, unknown>;
  const id = readSeriesId(data.id);

  if (typeof id !== "string") {
    return id;
  }

  const description = readDescription(data.description);

  if (typeof description !== "string") {
    return description;
  }

  const amount = readAmount(data.amount);

  if (typeof amount !== "number") {
    return amount;
  }

  const type = readType(data.type);

  if (type !== "INCOME" && type !== "EXPENSE") {
    return type;
  }

  const accountId = readAccountId(data.accountId);

  if (typeof accountId !== "string") {
    return accountId;
  }

  const dayOfMonth = readDayOfMonth(data.dayOfMonth);

  if (typeof dayOfMonth !== "number") {
    return dayOfMonth;
  }

  return {
    ok: true,
    value: {
      id,
      accountId,
      description,
      amount,
      type,
      dayOfMonth,
    },
  };
}

function readSeriesId(
  value: unknown
): string | ParseFailure {
  if (typeof value !== "string" || !value.trim() || value.trim().length > 64) {
    return {
      ok: false,
      message: "Não foi possível identificar a repetição.",
    };
  }

  return value.trim();
}

function readDayOfMonth(
  value: unknown
): number | ParseFailure {
  const day = typeof value === "number"
    ? value
    : typeof value === "string" && /^\d{1,2}$/.test(value.trim())
      ? Number(value.trim())
      : Number.NaN;

  if (!Number.isInteger(day) || day < 1 || day > 31) {
    return {
      ok: false,
      message: "Informe um dia entre 1 e 31.",
    };
  }

  return day;
}

function readRepeatsMonthly(
  value: unknown
): boolean | ParseFailure {
  if (value === undefined || value === null || value === false) {
    return false;
  }

  if (value === true) {
    return true;
  }

  return {
    ok: false,
    message: "Não foi possível ler a repetição.",
  };
}

function readNotes(
  value: unknown
): string | undefined | ParseFailure {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    return {
      ok: false,
      message: "Não foi possível ler as observações.",
    };
  }

  const notes = value.trim();

  if (!notes) {
    return undefined;
  }

  if (notes.length > 500) {
    return {
      ok: false,
      message: "As observações podem ter no máximo 500 caracteres.",
    };
  }

  return notes;
}

function parseAmount(value: unknown): number | null {
  if (typeof value === "number") {
    return normalizeAmount(value);
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value
    .trim()
    .replace(/\s/g, "")
    .replace(/^R\$/i, "");

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
  } else if (/^\d{1,3}(\.\d{3})+$/.test(trimmed)) {
    normalized = trimmed.replace(/\./g, "");
  } else if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return null;
  }

  return normalizeAmount(Number(normalized));
}

function normalizeAmount(amount: number): number | null {
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    return null;
  }

  const cents = Math.round(amount * 100);

  if (Math.abs(amount * 100 - cents) > 0.001) {
    return null;
  }

  return cents / 100;
}
