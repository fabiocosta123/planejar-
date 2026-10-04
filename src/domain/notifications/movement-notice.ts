import { SubscriptionPlan } from "../financial/rules/transaction-history-window.rule";

export type NoticeKind = "LEDGER_MOVEMENT" | "BANK_MOVEMENT";

export type MovementType = "INCOME" | "EXPENSE";

export type NoticeLevel = "NONE" | "IMPORTANT" | "ALL";

export function shouldNotifyPrincipal(
  actorMemberId: string,
  ledgerMemberId: string
) {
  return actorMemberId !== ledgerMemberId;
}

export function canNotifyBankMovement(plan: SubscriptionPlan) {
  return plan === "PRO";
}

export function acceptsMovementNotice(level: NoticeLevel) {
  return level !== "NONE";
}

export function noticeTitle(kind: NoticeKind, movementType: MovementType) {
  if (kind === "BANK_MOVEMENT") {
    return movementType === "INCOME" ? "Entrada no banco" : "Saída no banco";
  }

  return movementType === "INCOME" ? "Nova entrada" : "Nova saída";
}
