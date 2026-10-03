export type SubscriptionPlan = "FREE" | "PRO";

export const FREE_HISTORY_MONTHS = 3;

export function resolveHistoryStart(
  plan: SubscriptionPlan,
  referenceDate: Date
): Date | null {

  if (plan === "PRO") {
    return null;
  }

  const start = new Date(referenceDate);
  start.setMonth(start.getMonth() - FREE_HISTORY_MONTHS);
  start.setHours(0, 0, 0, 0);

  return start;
}
