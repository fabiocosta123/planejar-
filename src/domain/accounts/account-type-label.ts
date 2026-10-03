const ACCOUNT_TYPE_LABELS = {
  CHECKING: "Conta corrente",
  SAVINGS: "Poupança",
  CASH: "Carteira",
  INVESTMENT: "Investimento",
  OTHER: "Outra",
} as const;

export type AccountTypeCode = keyof typeof ACCOUNT_TYPE_LABELS;

export function accountTypeLabel(type: string) {
  if (type in ACCOUNT_TYPE_LABELS) {
    return ACCOUNT_TYPE_LABELS[type as AccountTypeCode];
  }

  return "Outra";
}

export function isAccountType(type: string): type is AccountTypeCode {
  return type in ACCOUNT_TYPE_LABELS;
}
