import { beforeEach, describe, expect, it, vi } from "vitest";

import { accountsService } from "../accounts.service";
import { accountsRepository } from "../../repositories/accounts.repository";
import { transactionsRepository } from "../../repositories/transactions.repository";
import { familyContextService } from "../family-context.service";
import { familyMemberService } from "../family-member.service";
import { AccountWriteError } from "../errors/account-write.error";

describe("contas do saldo", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calcula o saldo de cada conta até a data", async () => {
    vi.spyOn(accountsRepository, "findByFamilyMember").mockResolvedValue([
      {
        id: "account-1",
        name: "Conta Principal",
        type: "CHECKING",
        initialBalance: 100,
        isDefault: true,
        isActive: true,
        deletedAt: null,
      },
    ] as never);

    vi.spyOn(transactionsRepository, "findByAccountId").mockResolvedValue([
      {
        amount: 40,
        type: "EXPENSE",
        status: "COMPLETED",
        transactionDate: new Date(2026, 9, 2),
      },
    ] as never);

    const result = await accountsService.listForLedger(
      "owner-member",
      new Date(2026, 9, 3)
    );

    expect(result).toEqual([
      {
        id: "account-1",
        name: "Conta Principal",
        type: "CHECKING",
        typeLabel: "Conta corrente",
        balance: 60,
        isDefault: true,
        isActive: true,
      },
    ]);
  });

  it("marca a primeira conta como padrão dos lançamentos", async () => {
    vi.spyOn(familyContextService, "getCurrentContext").mockResolvedValue({
      familyId: "family-1",
      familyMemberId: "owner-member",
      ledgerMemberId: "owner-member",
    });

    vi.spyOn(familyMemberService, "findById").mockResolvedValue({
      id: "owner-member",
      role: "OWNER",
      deletedAt: null,
    } as never);

    vi.spyOn(accountsRepository, "findByFamilyMember").mockResolvedValue([]);

    vi.spyOn(accountsRepository, "create").mockResolvedValue({
      id: "account-new",
    } as never);

    const defaultSpy = vi
      .spyOn(accountsRepository, "setDefault")
      .mockResolvedValue(1);

    await accountsService.createForUser("user-1", {
      name: "Carteira",
      type: "CASH",
      initialBalance: "0,00",
      initialBalanceDate: "2026-10-03",
    });

    expect(defaultSpy).toHaveBeenCalledWith("owner-member", "account-new");
  });

  it("recusa cadastro de quem só consulta", async () => {
    vi.spyOn(familyContextService, "getCurrentContext").mockResolvedValue({
      familyId: "family-1",
      familyMemberId: "viewer-member",
      ledgerMemberId: "owner-member",
    });

    vi.spyOn(familyMemberService, "findById").mockResolvedValue({
      id: "viewer-member",
      role: "VIEWER",
      deletedAt: null,
    } as never);

    const createSpy = vi.spyOn(accountsRepository, "create");

    await expect(
      accountsService.createForUser("user-1", {
        name: "Carteira",
        type: "CASH",
        initialBalance: "0,00",
        initialBalanceDate: "2026-10-03",
      })
    ).rejects.toBeInstanceOf(AccountWriteError);

    expect(createSpy).not.toHaveBeenCalled();
  });
});
