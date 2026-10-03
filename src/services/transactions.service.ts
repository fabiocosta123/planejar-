import { transactionsRepository } from "../repositories/transactions.repository";
import { accountsRepository } from "../repositories/accounts.repository";
import { FinancialPeriod } from "../domain/financial/models/financial-period";
import { financialEngine } from "../domain/financial/engine/financial-engine";
import { financialFlowEngine } from "../domain/financial/engine/financial-flow-engine";
import { tightDayRule } from "../domain/financial/rules/tight-day.rule";
import { TransactionSummaryMapper } from "../repositories/mappers/transaction-summary.mapper";
import { parseCreateTransactionInput } from "../contracts/transactions/parse-create-transaction";
import { familyContextService } from "./family-context.service";
import { familyMemberService } from "./family-member.service";
import { TransactionCreateError } from "./errors/transaction-create.error";
import { historyComparisonRule } from "../domain/financial/rules/history-comparison.rule";
import {
  resolveHistoryStart,
  SubscriptionPlan,
} from "../domain/financial/rules/transaction-history-window.rule";
import {
  toComparisonContract,
  TransactionHistoryContract,
} from "../contracts/financial/transaction-history.contract";
import { recurringTransactionsRepository } from "../repositories/recurring-transactions.repository";
import {
  projectMonthlyOccurrences,
  recurrenceHorizonEnd,
} from "../domain/financial/rules/recurrence.rule";
import { TransactionInput } from "../domain/financial/models/transaction-input";

export class TransactionsService {

  async calculateSummary(
    familyMemberId: string,
    period: FinancialPeriod,
    currentBalance: number,
    spendingLimit?: number
  ) {

    const transactions =
      await transactionsRepository.findByPeriod(
        familyMemberId,
        period
      );

    return financialEngine.calculateSummary(
      currentBalance,
      transactions,
      spendingLimit
    );

  }

  async calculateDashboard(
    familyMemberId: string,
    period: FinancialPeriod,
    currentBalance: number,
    spendingLimit?: number,
    referenceDate: Date = new Date(),
    minimumReserve = 0
  ) {

    const horizonEnd = recurrenceHorizonEnd(referenceDate);

    const [transactions, upcoming, rules] =
      await Promise.all([
        transactionsRepository.findByPeriod(
          familyMemberId,
          period
        ),
        transactionsRepository.findAfter(
          familyMemberId,
          period.endDate,
          horizonEnd
        ),
        recurringTransactionsRepository.findActiveByFamilyMember(
          familyMemberId
        ),
      ]);

    const summary =
      financialEngine.calculateSummary(
        currentBalance,
        transactions,
        spendingLimit
      );

    const futureBalance =
      financialEngine.calculateFutureBalance(
        currentBalance,
        transactions,
        referenceDate
      );

    const financialFlow =
      financialFlowEngine.calculate(
        currentBalance,
        transactions
      );

    const upcomingInputs: TransactionInput[] = upcoming.map(
      (transaction) => ({
        amount: Number(transaction.amount),
        type: transaction.type,
        status: transaction.status,
        transactionDate: transaction.transactionDate,
      })
    );

    const projected = projectMonthlyOccurrences(
      rules.map((rule) => ({
        amount: Number(rule.amount),
        type: rule.type,
        description: rule.description,
        startDate: rule.startDate,
        endDate: rule.endDate,
      })),
      referenceDate,
      horizonEnd,
      upcoming
        .filter((transaction) => transaction.status !== "CANCELED")
        .map((transaction) => ({
          description: transaction.description,
          type: transaction.type,
          transactionDate: transaction.transactionDate,
        }))
    );

    const tightDay =
      tightDayRule.calculate(
        currentBalance,
        [
          ...transactions,
          ...upcomingInputs,
          ...projected,
        ],
        referenceDate,
        minimumReserve
      );

    return {
      summary,
      futureBalance,
      financialFlow,
      tightDay
    };

  }

  async calculateFutureBalance(
    familyMemberId: string,
    period: FinancialPeriod,
    currentBalance: number,
    referenceDate: Date = new Date()
  ) {

    const transactions =
      await transactionsRepository.findByPeriod(
        familyMemberId,
        period
      );

    return financialEngine.calculateFutureBalance(
      currentBalance,
      transactions,
      referenceDate
    );

  }

  async calculateFinancialFlow(
    familyMemberId: string,
    period: FinancialPeriod,
    initialBalance: number
  ) {

    const transactions =
      await transactionsRepository.findByPeriod(
        familyMemberId,
        period
      );

    return financialFlowEngine.calculate(
      initialBalance,
      transactions
    );

  }

  async findSummaryByPeriod(
    familyMemberId: string,
    period: FinancialPeriod
  ) {
    const transactions =
      await transactionsRepository.findSummaryByPeriod(
        familyMemberId,
        period
      );

    return transactions.map((transaction) =>
      TransactionSummaryMapper.toContract(transaction)
    );
  }

  async getHistory(
    familyMemberId: string,
    plan: SubscriptionPlan,
    referenceDate: Date = new Date()
  ): Promise<TransactionHistoryContract> {

    const historyStart = resolveHistoryStart(
      plan,
      referenceDate
    );

    const transactions =
      await transactionsRepository.findSummarySince(
        familyMemberId,
        historyStart
      );

    const historyTransactions = transactions.map((transaction) => ({
      amount: Number(transaction.amount),
      type: transaction.type,
      status: transaction.status,
      transactionDate: transaction.transactionDate,
    }));

    const currentMonthStart = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      1
    );

    const currentMonthEnd = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const comparison =
      plan === "PRO"
        ? historyComparisonRule.compare(
            historyTransactions,
            referenceDate
          )
        : null;

    return {
      plan,
      historyStart,
      transactions: transactions.map((transaction) =>
        TransactionSummaryMapper.toContract(transaction)
      ),
      currentMonth: historyComparisonRule.sum(
        historyTransactions,
        currentMonthStart,
        currentMonthEnd
      ),
      comparison: comparison
        ? toComparisonContract(comparison)
        : null,
    };
  }

  async createForUser(
    userId: string,
    input: unknown
  ) {
    const parsed = parseCreateTransactionInput(input);

    if (!parsed.ok) {
      throw new TransactionCreateError(parsed.message);
    }

    const context =
      await familyContextService.getCurrentContext(userId);

    if (!context) {
      throw new TransactionCreateError(
        "Nenhuma família encontrada."
      );
    }

    const member = await familyMemberService.findById(
      context.familyMemberId
    );

    if (!member || member.deletedAt) {
      throw new TransactionCreateError(
        "Nenhuma família encontrada."
      );
    }

    if (member.role === "VIEWER") {
      throw new TransactionCreateError(
        "Seu acesso permite apenas consulta."
      );
    }

    const account = await accountsRepository.findById(
      parsed.value.accountId
    );

    if (
      !account ||
      account.deletedAt ||
      account.isActive === false ||
      account.familyMemberId !== context.familyMemberId
    ) {
      throw new TransactionCreateError(
        "Conta não encontrada."
      );
    }

    const transaction = await transactionsRepository.create({
      familyMemberId: context.familyMemberId,
      accountId: account.id,
      description: parsed.value.description,
      notes: parsed.value.notes,
      amount: parsed.value.amount,
      type: parsed.value.type,
      status: "COMPLETED",
      transactionDate: parsed.value.transactionDate,
    });

    if (parsed.value.repeatsMonthly) {
      await recurringTransactionsRepository.create({
        familyMemberId: context.familyMemberId,
        accountId: account.id,
        description: parsed.value.description,
        amount: parsed.value.amount,
        type: parsed.value.type,
        startDate: parsed.value.transactionDate,
      });
    }

    return transaction;
  }

}

export const transactionsService =
  new TransactionsService();