import { transactionsService } from "../../services/transactions.service";
import { SubscriptionPlan } from "../../domain/financial/rules/transaction-history-window.rule";

export async function getTransactionHistoryAction(
  familyMemberId: string,
  plan: SubscriptionPlan,
  referenceDate: Date = new Date()
) {
  return transactionsService.getHistory(
    familyMemberId,
    plan,
    referenceDate
  );
}
