import { transactionsRepository } from "../repositories/transactions.repository";
import { FinancialPeriod } from "../domain/financial/models/financial-period";
import { financialEngine } from "../domain/financial/engine/financial-engine";
import { financialFlowEngine } from "../domain/financial/engine/financial-flow-engine";

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

}

export const transactionsService =
  new TransactionsService();