import { isAccountType, AccountTypeCode } from "../../domain/accounts/account-type-label";

const MAX_AMOUNT = 9_999_999_999.99;
const MIN_YEAR = 2000;
const MAX_YEAR = 2100;

export interface ParsedCreateAccount {
  name: string;
  type: AccountTypeCode;
  initialBalance: number;
  initialBalanceDate: Date;
  useAsDefault: boolean;
}

export type ParseCreateAccountResult =
  | { ok: true; value: ParsedCreateAccount }
  | { ok: false; message: string };

export function parseCreateAccountInput(
  input: unknown
): ParseCreateAccountResult {
  if (!input || typeof input !== "object") {
    return { ok: false, message: "Não foi possível ler a conta." };
  }

  const data = input as Record<string, unknown>;
  const name = readName(data.name);

  if (typeof name !== "string") {
    return name;
  }

  const type = readType(data.type);

  if (typeof type !== "string") {
    return type;
  }

  const initialBalance = readInitialBalance(data.initialBalance);

  if (typeof initialBalance !== "number") {
    return initialBalance;
  }

  const initialBalanceDate = readDate(data.initialBalanceDate);

  if (!(initialBalanceDate instanceof Date)) {
    return initialBalanceDate;
  }

  return {
    ok: true,
    value: {
      name,
      type,
      initialBalance,
      initialBalanceDate,
      useAsDefault: data.useAsDefault === true,
    },
  };
}

function readName(value: unknown): string | ParseCreateAccountResult {
  if (typeof value !== "string") {
    return { ok: false, message: "Informe o nome da conta." };
  }

  const name = value.trim();

  if (name.length < 2) {
    return { ok: false, message: "Informe o nome da conta." };
  }

  if (name.length > 60) {
    return { ok: false, message: "O nome pode ter no máximo 60 caracteres." };
  }

  return name;
}

function readType(value: unknown): AccountTypeCode | ParseCreateAccountResult {
  if (typeof value === "string" && isAccountType(value)) {
    return value;
  }

  return { ok: false, message: "Escolha o tipo da conta." };
}

function readInitialBalance(
  value: unknown
): number | ParseCreateAccountResult {
  const amount = parseInitialBalance(value);

  if (amount === null) {
    return {
      ok: false,
      message: "Informe um saldo inicial igual ou maior que zero.",
    };
  }

  return amount;
}

function readDate(value: unknown): Date | ParseCreateAccountResult {
  if (typeof value !== "string") {
    return { ok: false, message: "Informe a data do saldo inicial." };
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return { ok: false, message: "Informe a data do saldo inicial." };
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
    return { ok: false, message: "Informe a data do saldo inicial." };
  }

  return date;
}

function parseInitialBalance(value: unknown): number | null {
  if (typeof value === "number") {
    return normalizeBalance(value);
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

  return normalizeBalance(Number(normalized));
}

function normalizeBalance(amount: number): number | null {
  if (!Number.isFinite(amount) || amount < 0 || amount > MAX_AMOUNT) {
    return null;
  }

  const cents = Math.round(amount * 100);

  if (Math.abs(amount * 100 - cents) > 0.001) {
    return null;
  }

  return cents / 100;
}
