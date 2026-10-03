import { transactionsRepository } from "../repositories/transactions.repository";
import { accountsRepository } from "../repositories/accounts.repository";
import { FinancialPeriod } from "../domain/financial/models/financial-period";
import { financialEngine } from "../domain/financial/engine/financial-engine";
import { financialFlowEngine } from "../domain/financial/engine/financial-flow-engine";
import { TransactionSummaryMapper } from "../repositories/mappers/transaction-summary.mapper";
import { parseCreateTransactionInput } from "../contracts/transactions/parse-create-transaction";
import { familyContextService } from "./family-context.service";
import { familyMemberService } from "./family-member.service";
import { TransactionCreateError } from "./errors/transaction-create.error";

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
    referenceDate: Date = new Date()
  ) {

    const transactions =
      await transactionsRepository.findByPeriod(
        familyMemberId,
        period
      );

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

    return {
      summary,
      futureBalance,
      financialFlow
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

    return transactionsRepository.create({
      familyMemberId: context.familyMemberId,
      accountId: account.id,
      description: parsed.value.description,
      notes: parsed.value.notes,
      amount: parsed.value.amount,
      type: parsed.value.type,
      status: "COMPLETED",
      transactionDate: parsed.value.transactionDate,
    });
  }

}

export const transactionsService =
  new TransactionsService();