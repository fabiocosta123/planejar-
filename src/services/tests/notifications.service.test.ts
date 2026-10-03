import { beforeEach, describe, expect, it, vi } from "vitest";

import { notificationsService } from "../notifications.service";
import { notificationsRepository } from "../../repositories/notifications.repository";
import { familyRepository } from "../../repositories/family.repository";
import { userRepository } from "../../repositories/user.repository";
import { userSettingsRepository } from "../../repositories/user-settings.repository";

describe("NotificationsService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("grava aviso para o principal quando um familiar lança", async () => {
    vi.spyOn(familyRepository, "findById").mockResolvedValue({
      id: "family-1",
      ownerId: "owner-1",
      deletedAt: null,
    } as never);

    vi.spyOn(userSettingsRepository, "findByUserId").mockResolvedValue({
      notificationLevel: "IMPORTANT",
    } as never);

    vi.spyOn(userRepository, "findById").mockResolvedValue({
      name: "Ana",
    } as never);

    const createSpy = vi
      .spyOn(notificationsRepository, "create")
      .mockResolvedValue({ id: "notice-1" } as never);

    await notificationsService.notifyLedgerMovement({
      familyId: "family-1",
      actorMemberId: "child-member",
      ledgerMemberId: "owner-member",
      actorUserId: "child-user",
      description: "Lanche",
      amount: 18.5,
      movementType: "EXPENSE",
    });

    expect(createSpy).toHaveBeenCalledWith({
      userId: "owner-1",
      familyId: "family-1",
      kind: "LEDGER_MOVEMENT",
      actorName: "Ana",
      description: "Lanche",
      amount: 18.5,
      movementType: "EXPENSE",
    });
  });

  it("não grava aviso do lançamento do próprio principal", async () => {
    const createSpy = vi.spyOn(notificationsRepository, "create");

    const result = await notificationsService.notifyLedgerMovement({
      familyId: "family-1",
      actorMemberId: "owner-member",
      ledgerMemberId: "owner-member",
      description: "Salário",
      amount: 100,
      movementType: "INCOME",
    });

    expect(result).toBeNull();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("não grava aviso quando o principal desligou as notificações", async () => {
    vi.spyOn(familyRepository, "findById").mockResolvedValue({
      id: "family-1",
      ownerId: "owner-1",
      deletedAt: null,
    } as never);

    vi.spyOn(userSettingsRepository, "findByUserId").mockResolvedValue({
      notificationLevel: "NONE",
    } as never);

    const createSpy = vi.spyOn(notificationsRepository, "create");

    const result = await notificationsService.notifyLedgerMovement({
      familyId: "family-1",
      actorMemberId: "child-member",
      ledgerMemberId: "owner-member",
      description: "Lanche",
      amount: 10,
      movementType: "EXPENSE",
    });

    expect(result).toBeNull();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("não grava movimentação bancária na versão grátis", async () => {
    const createSpy = vi.spyOn(notificationsRepository, "create");

    const result = await notificationsService.recordBankMovement({
      ownerUserId: "owner-1",
      familyId: "family-1",
      plan: "FREE",
      description: "Pix recebido",
      amount: 50,
      movementType: "INCOME",
    });

    expect(result).toBeNull();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("grava movimentação bancária só no Pro", async () => {
    vi.spyOn(userSettingsRepository, "findByUserId").mockResolvedValue({
      notificationLevel: "ALL",
    } as never);

    const createSpy = vi
      .spyOn(notificationsRepository, "create")
      .mockResolvedValue({ id: "notice-bank" } as never);

    await notificationsService.recordBankMovement({
      ownerUserId: "owner-1",
      familyId: "family-1",
      plan: "PRO",
      description: "Pix recebido",
      amount: 50,
      movementType: "INCOME",
    });

    expect(createSpy).toHaveBeenCalledWith({
      userId: "owner-1",
      familyId: "family-1",
      kind: "BANK_MOVEMENT",
      actorName: null,
      description: "Pix recebido",
      amount: 50,
      movementType: "INCOME",
    });
  });
});
