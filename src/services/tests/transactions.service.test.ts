import { describe, expect, it, vi, beforeEach } from "vitest";

import { transactionsService } from "../transactions.service";
import { transactionsRepository } from "../../repositories/transactions.repository";
import { recurringTransactionsRepository } from "../../repositories/recurring-transactions.repository";
import { accountsRepository } from "../../repositories/accounts.repository";
import { financialEngine } from "../../domain/financial/engine/financial-engine";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";
import { TransactionInput } from "../../domain/financial/models/transaction-input";
import { familyContextService } from "../family-context.service";
import { familyMemberService } from "../family-member.service";
import { TransactionCreateError } from "../errors/transaction-create.error";
import { notificationsService } from "../notifications.service";

describe("TransactionsService", () => {


  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("deve calcular o saldo futuro através do FinancialEngine", async () => {

    const transactions: TransactionInput[] = [
      {
        amount: 1000,
        type: "INCOME",
        transactionDate: new Date("2026-08-10"),
        status: "COMPLETED"
      },
      {
        amount: 300,
        type: "EXPENSE",
        transactionDate: new Date("2026-08-15"),
        status: "COMPLETED"
      }
    ];

    vi.spyOn(
      transactionsRepository,
      "findByPeriod"
    ).mockResolvedValue(
      transactions
    );

    const result =
      await transactionsService.calculateFutureBalance(
        "family-member-id",
        new FinancialPeriod(
          new Date("2026-08-01"),
          new Date("2026-08-31")
        ),
        1000,
        new Date("2026-08-07")
      );

    expect(result.currentBalance)
      .toBe(1000);

    expect(result.futureIncome).toBe(1000);
    expect(result.futureExpenses).toBe(300);
    expect(result.futureBalance).toBe(1700);

  });

  it("deve calcular o fluxo financeiro através do FinancialFlowEngine", async () => {

    const transactions: TransactionInput[] = [
      {
        amount: 1000,
        type: "INCOME",
        transactionDate: new Date("2026-08-10"),
        status: "COMPLETED"
      },
      {
        amount: 500,
        type: "EXPENSE",
        transactionDate: new Date("2026-08-15"),
        status: "COMPLETED"
      }
    ];

    vi.spyOn(
      transactionsRepository,
      "findByPeriod"
    ).mockResolvedValue(
      transactions,

    );

    const result =
      await transactionsService.calculateFinancialFlow(
        "family-member-id",
        new FinancialPeriod(
          new Date("2026-08-01"),
          new Date("2026-08-31")
        ),
        1000
      );

    expect(result)
      .toHaveLength(2);

    expect(result[0].date)
      .toEqual(new Date("2026-08-10"));

    expect(result[0].income)
      .toBe(1000);

    expect(result[0].expenses)
      .toBe(0);

    expect(result[0].balance)
      .toBe(2000);

    expect(result[1].date)
      .toEqual(new Date("2026-08-15"));

    expect(result[1].income)
      .toBe(0);

    expect(result[1].expenses)
      .toBe(500);

    expect(result[1].balance)
      .toBe(1500);

  });





  it("deve calcular resumo financeiro das transações do período", async () => {


    const transactions = [
      {
        id: "1",
        description: "Salário",
        amount: 5000,
        type: "INCOME",
        transactionDate: new Date("2026-08-10"),
        status: "COMPLETED"
      },
      {
        id: "2",
        description: "Mercado",
        amount: 1000,
        type: "EXPENSE",
        transactionDate: new Date("2026-08-15"),
        status: "COMPLETED"
      }
    ];



    vi.spyOn(
      transactionsRepository,
      "findByPeriod"
    )
      .mockResolvedValue(
        transactions as any
      );



    const engineSpy =
      vi.spyOn(
        financialEngine,
        "calculateSummary"
      )
        .mockReturnValue({
          income: 5000,
          expenses: 1000,
          balance: 4000,
          limitExceeded: false
        } as any);



    const period =
      new FinancialPeriod(
        new Date("2026-08-01"),
        new Date("2026-08-31")
      );



    const result =
      await transactionsService.calculateSummary(
        "family-member-id",
        period
      );



    expect(
      transactionsRepository.findByPeriod
    )
      .toHaveBeenCalledWith(
        "family-member-id",
        period
      );



    expect(
      engineSpy
    )
      .toHaveBeenCalled();



    expect(result.balance)
      .toBe(4000);


  });

  it("deve incluir o dia do aperto no dashboard", async () => {
    vi.spyOn(
      transactionsRepository,
      "findByPeriod"
    ).mockResolvedValue([
      {
        amount: 200,
        type: "EXPENSE",
        status: "COMPLETED",
        transactionDate: new Date(2026, 9, 20),
      },
    ]);

    vi.spyOn(
      transactionsRepository,
      "findAfter"
    ).mockResolvedValue([]);

    vi.spyOn(
      recurringTransactionsRepository,
      "findActiveByFamilyMember"
    ).mockResolvedValue([]);

    const result =
      await transactionsService.calculateDashboard(
        "family-member-id",
        new FinancialPeriod(
          new Date(2026, 9, 1),
          new Date(2026, 9, 31, 23, 59, 59, 999)
        ),
        100,
        undefined,
        new Date(2026, 9, 3),
        0
      );

    expect(result.tightDay?.date)
      .toEqual(new Date(2026, 9, 20));

    expect(result.tightDay?.shortfall)
      .toBe(100);

    expect(result.tightDay?.daysRemaining)
      .toBe(17);

    expect(result.tightDay?.dailyAmount)
      .toBe(5.89);
  });

  it("deve levar a recorrência mensal ao dia do aperto", async () => {
    vi.spyOn(
      transactionsRepository,
      "findByPeriod"
    ).mockResolvedValue([]);

    vi.spyOn(
      transactionsRepository,
      "findAfter"
    ).mockResolvedValue([]);

    vi.spyOn(
      recurringTransactionsRepository,
      "findActiveByFamilyMember"
    ).mockResolvedValue([
      {
        amount: 150,
        type: "EXPENSE",
        description: "Aluguel",
        startDate: new Date(2026, 9, 3),
        endDate: null,
      },
    ] as any);

    const result =
      await transactionsService.calculateDashboard(
        "family-member-id",
        new FinancialPeriod(
          new Date(2026, 9, 1),
          new Date(2026, 9, 31, 23, 59, 59, 999)
        ),
        100,
        undefined,
        new Date(2026, 9, 3),
        0
      );

    expect(result.tightDay?.date)
      .toEqual(new Date(2026, 10, 3));

    expect(result.tightDay?.shortfall)
      .toBe(50);

    expect(result.tightDay?.dailyAmount)
      .toBe(1.62);

    expect(result.summary.expenses)
      .toBe(0);
  });

  it("deve listar o resumo dos lançamentos do período", async () => {
    const period = new FinancialPeriod(
      new Date("2026-08-01"),
      new Date("2026-08-31")
    );

    vi.spyOn(
      transactionsRepository,
      "findSummaryByPeriod"
    ).mockResolvedValue([
      {
        id: "transaction-1",
        description: "Mercado",
        amount: 10.5,
        type: "EXPENSE",
        status: "COMPLETED",
        transactionDate: new Date("2026-08-20"),
      },
    ] as any);

    const result =
      await transactionsService.findSummaryByPeriod(
        "family-member-id",
        period
      );

    expect(result).toEqual([
      {
        id: "transaction-1",
        description: "Mercado",
        amount: 10.5,
        type: "EXPENSE",
        status: "COMPLETED",
        date: new Date("2026-08-20"),
      },
    ]);
  });

  it("deve criar o lançamento na conta do membro da sessão", async () => {
    vi.spyOn(
      familyContextService,
      "getCurrentContext"
    ).mockResolvedValue({
      familyId: "family-1",
      familyMemberId: "member-1",
    });

    vi.spyOn(
      familyMemberService,
      "findById"
    ).mockResolvedValue({
      id: "member-1",
      role: "MEMBER",
      deletedAt: null,
    } as any);

    vi.spyOn(
      accountsRepository,
      "findById"
    ).mockResolvedValue({
      id: "account-1",
      familyMemberId: "member-1",
      deletedAt: null,
      isActive: true,
    } as any);

    const createSpy = vi.spyOn(
      transactionsRepository,
      "create"
    ).mockResolvedValue({ id: "transaction-1" } as any);

    const noticeSpy = vi.spyOn(
      notificationsService,
      "notifyLedgerMovement"
    );

    await transactionsService.createForUser(
      "user-1",
      {
        familyMemberId: "other-member",
        accountId: "account-1",
        description: " Mercado ",
        amount: "1.234,56",
        type: "EXPENSE",
        transactionDate: "2026-08-20",
        notes: "  ",
      }
    );

    expect(createSpy).toHaveBeenCalledWith({
      familyMemberId: "member-1",
      accountId: "account-1",
      description: "Mercado",
      notes: undefined,
      amount: 1234.56,
      type: "EXPENSE",
      status: "COMPLETED",
      transactionDate: new Date(2026, 7, 20),
    });

    expect(noticeSpy).not.toHaveBeenCalled();
  });

  it("avisa o principal quando um familiar lança", async () => {
    vi.spyOn(
      familyContextService,
      "getCurrentContext"
    ).mockResolvedValue({
      familyId: "family-1",
      familyMemberId: "child-member",
      ledgerMemberId: "owner-member",
    });

    vi.spyOn(
      familyMemberService,
      "findById"
    ).mockResolvedValue({
      id: "child-member",
      userId: "child-user",
      role: "MEMBER",
      deletedAt: null,
    } as any);

    vi.spyOn(
      accountsRepository,
      "findById"
    ).mockResolvedValue({
      id: "account-1",
      familyMemberId: "owner-member",
      deletedAt: null,
      isActive: true,
    } as any);

    vi.spyOn(
      transactionsRepository,
      "create"
    ).mockResolvedValue({ id: "transaction-2" } as any);

    const noticeSpy = vi.spyOn(
      notificationsService,
      "notifyLedgerMovement"
    ).mockResolvedValue(null);

    await transactionsService.createForUser(
      "child-user",
      {
        accountId: "account-1",
        description: "Lanche",
        amount: "18,50",
        type: "EXPENSE",
        transactionDate: "2026-10-03",
      }
    );

    expect(noticeSpy).toHaveBeenCalledWith({
      familyId: "family-1",
      actorMemberId: "child-member",
      ledgerMemberId: "owner-member",
      actorUserId: "child-user",
      description: "Lanche",
      amount: 18.5,
      movementType: "EXPENSE",
    });
  });

  it("deve guardar a série mensal junto com o lançamento", async () => {
    vi.spyOn(
      familyContextService,
      "getCurrentContext"
    ).mockResolvedValue({
      familyId: "family-1",
      familyMemberId: "member-1",
    });

    vi.spyOn(
      familyMemberService,
      "findById"
    ).mockResolvedValue({
      id: "member-1",
      role: "MEMBER",
      deletedAt: null,
    } as any);

    vi.spyOn(
      accountsRepository,
      "findById"
    ).mockResolvedValue({
      id: "account-1",
      familyMemberId: "member-1",
      deletedAt: null,
      isActive: true,
    } as any);

    vi.spyOn(
      transactionsRepository,
      "create"
    ).mockResolvedValue({ id: "transaction-1" } as any);

    const recurrenceSpy = vi.spyOn(
      recurringTransactionsRepository,
      "create"
    ).mockResolvedValue({ id: "recurrence-1" } as any);

    await transactionsService.createForUser(
      "user-1",
      {
        accountId: "account-1",
        description: "Aluguel",
        amount: "800,00",
        type: "EXPENSE",
        transactionDate: "2026-10-10",
        repeatsMonthly: true,
      }
    );

    expect(recurrenceSpy).toHaveBeenCalledWith({
      familyMemberId: "member-1",
      accountId: "account-1",
      description: "Aluguel",
      amount: 800,
      type: "EXPENSE",
      startDate: new Date(2026, 9, 10),
      dayOfMonth: 10,
    });
  });

  it("deve alterar a repetição do membro da sessão", async () => {
    vi.spyOn(
      familyContextService,
      "getCurrentContext"
    ).mockResolvedValue({
      familyId: "family-1",
      familyMemberId: "member-1",
    });

    vi.spyOn(
      familyMemberService,
      "findById"
    ).mockResolvedValue({
      id: "member-1",
      role: "MEMBER",
      deletedAt: null,
    } as any);

    vi.spyOn(
      accountsRepository,
      "findById"
    ).mockResolvedValue({
      id: "account-1",
      familyMemberId: "member-1",
      deletedAt: null,
      isActive: true,
    } as any);

    const updateSpy = vi.spyOn(
      recurringTransactionsRepository,
      "updateOwned"
    ).mockResolvedValue({ count: 1 });

    await transactionsService.updateSeriesForUser(
      "user-1",
      {
        id: "series-1",
        accountId: "account-1",
        description: "Aluguel",
        amount: "900,00",
        type: "EXPENSE",
        dayOfMonth: 15,
      }
    );

    expect(updateSpy).toHaveBeenCalledWith(
      "series-1",
      "member-1",
      {
        accountId: "account-1",
        description: "Aluguel",
        amount: 900,
        type: "EXPENSE",
        dayOfMonth: 15,
      }
    );
  });

  it("deve encerrar a repetição do membro da sessão", async () => {
    vi.spyOn(
      familyContextService,
      "getCurrentContext"
    ).mockResolvedValue({
      familyId: "family-1",
      familyMemberId: "member-1",
    });

    vi.spyOn(
      familyMemberService,
      "findById"
    ).mockResolvedValue({
      id: "member-1",
      role: "OWNER",
      deletedAt: null,
    } as any);

    const stopSpy = vi.spyOn(
      recurringTransactionsRepository,
      "deactivateOwned"
    ).mockResolvedValue({ count: 1 });

    await transactionsService.stopSeriesForUser(
      "user-1",
      "series-1"
    );

    expect(stopSpy).toHaveBeenCalledWith(
      "series-1",
      "member-1"
    );
  });

  it("deve recusar alteração de quem só consulta", async () => {
    vi.spyOn(
      familyContextService,
      "getCurrentContext"
    ).mockResolvedValue({
      familyId: "family-1",
      familyMemberId: "member-1",
    });

    vi.spyOn(
      familyMemberService,
      "findById"
    ).mockResolvedValue({
      id: "member-1",
      role: "VIEWER",
      deletedAt: null,
    } as any);

    const updateSpy = vi.spyOn(
      recurringTransactionsRepository,
      "updateOwned"
    );

    await expect(
      transactionsService.updateSeriesForUser(
        "user-1",
        {
          id: "series-1",
          accountId: "account-1",
          description: "Aluguel",
          amount: "10,00",
          type: "EXPENSE",
          dayOfMonth: 5,
        }
      )
    ).rejects.toBeInstanceOf(TransactionCreateError);

    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("deve recusar lançamento de um membro somente leitura", async () => {
    vi.spyOn(
      familyContextService,
      "getCurrentContext"
    ).mockResolvedValue({
      familyId: "family-1",
      familyMemberId: "member-1",
    });

    vi.spyOn(
      familyMemberService,
      "findById"
    ).mockResolvedValue({
      id: "member-1",
      role: "VIEWER",
      deletedAt: null,
    } as any);

    const createSpy = vi.spyOn(
      transactionsRepository,
      "create"
    );

    await expect(
      transactionsService.createForUser(
        "user-1",
        {
          accountId: "account-1",
          description: "Mercado",
          amount: "10,00",
          type: "EXPENSE",
          transactionDate: "2026-08-20",
        }
      )
    ).rejects.toBeInstanceOf(TransactionCreateError);

    expect(createSpy).not.toHaveBeenCalled();
  });

  it("deve recusar conta que não pertence ao membro", async () => {
    vi.spyOn(
      familyContextService,
      "getCurrentContext"
    ).mockResolvedValue({
      familyId: "family-1",
      familyMemberId: "member-1",
    });

    vi.spyOn(
      familyMemberService,
      "findById"
    ).mockResolvedValue({
      id: "member-1",
      role: "OWNER",
      deletedAt: null,
    } as any);

    vi.spyOn(
      accountsRepository,
      "findById"
    ).mockResolvedValue({
      id: "account-2",
      familyMemberId: "member-2",
      deletedAt: null,
      isActive: true,
    } as any);

    const createSpy = vi.spyOn(
      transactionsRepository,
      "create"
    );

    await expect(
      transactionsService.createForUser(
        "user-1",
        {
          accountId: "account-2",
          description: "Mercado",
          amount: 10,
          type: "INCOME",
          transactionDate: "2026-08-20",
        }
      )
    ).rejects.toThrow("Conta não encontrada.");

    expect(createSpy).not.toHaveBeenCalled();
  });


});