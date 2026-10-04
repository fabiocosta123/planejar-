import { transactionsRepository } from "../repositories/transactions.repository";
import { accountsRepository } from "../repositories/accounts.repository";
import { FinancialPeriod } from "../domain/financial/models/financial-period";
import { financialEngine } from "../domain/financial/engine/financial-engine";
import { financialFlowEngine } from "../domain/financial/engine/financial-flow-engine";
import { tightDayRule } from "../domain/financial/rules/tight-day.rule";
import { TransactionSummaryMapper } from "../repositories/mappers/transaction-summary.mapper";
import {
  parseCreateTransactionInput,
  parseUpdateSeriesInput,
  readDailyEndProblem,
  readSeriesEndProblem,
} from "../contracts/transactions/parse-create-transaction";
import { weekdaysLabel } from "../domain/financial/rules/weekdays";
import { SeriesContract } from "../contracts/financial/series.contract";
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
  projectRecurringOccurrences,
  recurrenceHorizonEnd,
} from "../domain/financial/rules/recurrence.rule";
import { TransactionInput } from "../domain/financial/models/transaction-input";
import { shouldNotifyPrincipal } from "../domain/notifications/movement-notice";
import { notificationsService } from "./notifications.service";

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
    minimumReserve = 0,
    includeTightDay = true
  ) {

    const horizonEnd = recurrenceHorizonEnd(referenceDate);

    const [transactions, laterTransactions, rules] =
      await Promise.all([
        transactionsRepository.findByPeriod(
          familyMemberId,
          period
        ),
        transactionsRepository.findAfter(
          familyMemberId,
          period.endDate
        ),
        includeTightDay
          ? recurringTransactionsRepository.findActiveByFamilyMember(
              familyMemberId
            )
          : Promise.resolve([]),
      ]);

    const summary =
      financialEngine.calculateSummary(
        currentBalance,
        transactions,
        spendingLimit
      );

    const laterInputs: TransactionInput[] = laterTransactions.map(
      (transaction) => ({
        amount: Number(transaction.amount),
        type: transaction.type,
        status: transaction.status,
        transactionDate: transaction.transactionDate,
      })
    );

    const futureBalance =
      financialEngine.calculateFutureBalance(
        currentBalance,
        [...transactions, ...laterInputs],
        referenceDate
      );

    const financialFlow =
      financialFlowEngine.calculate(
        currentBalance,
        transactions
      );

    const upcoming = includeTightDay
      ? laterTransactions.filter(
          (transaction) => transaction.transactionDate <= horizonEnd
        )
      : [];

    const upcomingInputs: TransactionInput[] = laterInputs.filter(
      (transaction) =>
        includeTightDay && transaction.transactionDate <= horizonEnd
    );

    const projected = projectRecurringOccurrences(
      rules.map((rule) => ({
        amount: Number(rule.amount),
        type: rule.type,
        description: rule.description,
        startDate: rule.startDate,
        endDate: rule.endDate,
        frequency: rule.frequency,
        dayOfMonth: rule.dayOfMonth,
        weekdays: rule.weekdays,
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

    const tightDay = includeTightDay
      ? tightDayRule.calculate(
          currentBalance,
          [
            ...transactions,
            ...upcomingInputs,
            ...projected,
          ],
          referenceDate,
          minimumReserve
        )
      : null;

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

    const ledgerMemberId = context.ledgerMemberId ?? context.familyMemberId;
    const account = await accountsRepository.findById(
      parsed.value.accountId
    );

    if (
      !account ||
      account.deletedAt ||
      account.isActive === false ||
      account.familyMemberId !== ledgerMemberId
    ) {
      throw new TransactionCreateError(
        "Conta não encontrada."
      );
    }

    const transaction = await transactionsRepository.create({
      familyMemberId: ledgerMemberId,
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
        familyMemberId: ledgerMemberId,
        accountId: account.id,
        description: parsed.value.description,
        amount: parsed.value.amount,
        type: parsed.value.type,
        startDate: parsed.value.transactionDate,
        dayOfMonth: parsed.value.transactionDate.getDate(),
        endDate: parsed.value.monthlyEndDate ?? null,
      });
    }

    if (parsed.value.daily) {
      await recurringTransactionsRepository.create({
        familyMemberId: ledgerMemberId,
        accountId: account.id,
        description: parsed.value.description,
        amount: parsed.value.amount,
        type: parsed.value.type,
        frequency: "DAILY",
        startDate: parsed.value.transactionDate,
        dayOfMonth: parsed.value.transactionDate.getDate(),
        weekdays: parsed.value.daily.weekdays,
        endDate: parsed.value.daily.endDate,
      });
    }

    if (shouldNotifyPrincipal(context.familyMemberId, ledgerMemberId)) {
      try {
        await notificationsService.notifyLedgerMovement({
          familyId: context.familyId,
          actorMemberId: context.familyMemberId,
          ledgerMemberId,
          actorUserId: member.userId,
          description: parsed.value.description,
          amount: parsed.value.amount,
          movementType: parsed.value.type,
        });
      } catch {
        return transaction;
      }
    }

    return transaction;
  }

  async listSeries(familyMemberId: string): Promise<SeriesContract[]> {
    const series =
      await recurringTransactionsRepository.findActiveByFamilyMember(
        familyMemberId
      );

    return series.map((item) => ({
      id: item.id,
      description: item.description,
      amount: Number(item.amount),
      type: item.type,
      frequency: item.frequency,
      dayOfMonth: item.dayOfMonth,
      weekdays: item.weekdays,
      scheduleLabel:
        item.frequency === "DAILY"
          ? weekdaysLabel(item.weekdays)
          : `todo dia ${item.dayOfMonth}`,
      startDate: toDateInput(item.startDate),
      endDate: item.endDate ? toDateInput(item.endDate) : null,
      accountId: item.accountId,
      accountName: item.account.name,
    }));
  }

  async updateSeriesForUser(userId: string, input: unknown) {
    const parsed = parseUpdateSeriesInput(input);

    if (!parsed.ok) {
      throw new TransactionCreateError(parsed.message);
    }

    const context = await this.requireWriter(userId);
    const ledgerMemberId = context.ledgerMemberId ?? context.familyMemberId;
    const account = await accountsRepository.findById(
      parsed.value.accountId
    );

    if (
      !account ||
      account.deletedAt ||
      account.isActive === false ||
      account.familyMemberId !== ledgerMemberId
    ) {
      throw new TransactionCreateError("Conta não encontrada.");
    }

    const base = {
      accountId: account.id,
      description: parsed.value.description,
      amount: parsed.value.amount,
      type: parsed.value.type,
    };

    const series = await recurringTransactionsRepository.findActiveOwned(
      parsed.value.id,
      ledgerMemberId
    );

    if (!series || series.frequency !== parsed.value.frequency) {
      throw new TransactionCreateError("Repetição não encontrada.");
    }

    let schedule:
      | { dayOfMonth: number; endDate: Date | null }
      | { weekdays: number[]; endDate: Date };

    if (parsed.value.frequency === "DAILY") {
      const problem = readDailyEndProblem(series.startDate, parsed.value.endDate);

      if (problem) {
        throw new TransactionCreateError(problem.message);
      }

      schedule = {
        weekdays: parsed.value.weekdays,
        endDate: parsed.value.endDate,
      };
    } else {
      const problem = readSeriesEndProblem(series.startDate, parsed.value.endDate);

      if (problem) {
        throw new TransactionCreateError(problem.message);
      }

      schedule = {
        dayOfMonth: parsed.value.dayOfMonth,
        endDate: parsed.value.endDate,
      };
    }

    const updated = await recurringTransactionsRepository.updateOwned(
      parsed.value.id,
      ledgerMemberId,
      { ...base, ...schedule },
      parsed.value.frequency
    );

    if (updated.count === 0) {
      throw new TransactionCreateError("Repetição não encontrada.");
    }
  }

  async stopSeriesForUser(userId: string, seriesId: string) {
    const context = await this.requireWriter(userId);
    const stopped = await recurringTransactionsRepository.deactivateOwned(
      seriesId,
      context.ledgerMemberId ?? context.familyMemberId
    );

    if (stopped.count === 0) {
      throw new TransactionCreateError("Repetição não encontrada.");
    }
  }

  private async requireWriter(userId: string) {
    const context =
      await familyContextService.getCurrentContext(userId);

    if (!context) {
      throw new TransactionCreateError("Nenhuma família encontrada.");
    }

    const member = await familyMemberService.findById(
      context.familyMemberId
    );

    if (!member || member.deletedAt) {
      throw new TransactionCreateError("Nenhuma família encontrada.");
    }

    if (member.role === "VIEWER") {
      throw new TransactionCreateError(
        "Seu acesso permite apenas consulta."
      );
    }

    return context;
  }

}

function toDateInput(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

export const transactionsService =
  new TransactionsService();