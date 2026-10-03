import { SubscriptionPlan } from "./transaction-history-window.rule";

export function canAccessTightDay(plan: SubscriptionPlan) {
  return plan === "PRO";
}

export function paymentAmountMatches(
  expected: number,
  reported: number | null
) {
  if (
    reported === null ||
    !Number.isFinite(reported) ||
    !Number.isFinite(expected)
  ) {
    return false;
  }

  return Math.abs(expected - reported) < 0.009;
}
