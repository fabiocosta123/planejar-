import { familyRepository } from "../repositories/family.repository";
import { notificationsRepository } from "../repositories/notifications.repository";
import { userRepository } from "../repositories/user.repository";
import { userSettingsRepository } from "../repositories/user-settings.repository";
import {
  acceptsMovementNotice,
  canNotifyBankMovement,
  NoticeLevel,
  noticeTitle,
  shouldNotifyPrincipal,
  MovementType,
} from "../domain/notifications/movement-notice";
import { SubscriptionPlan } from "../domain/financial/rules/transaction-history-window.rule";

export interface NoticeContract {
  id: string;
  kind: "LEDGER_MOVEMENT" | "BANK_MOVEMENT";
  title: string;
  actorName: string | null;
  description: string;
  amount: number;
  movementType: MovementType;
  createdAt: string;
}

export class NotificationsService {
  async notifyLedgerMovement(input: {
    familyId: string;
    actorMemberId: string;
    ledgerMemberId: string;
    actorUserId?: string | null;
    description: string;
    amount: number;
    movementType: MovementType;
  }) {
    if (!shouldNotifyPrincipal(input.actorMemberId, input.ledgerMemberId)) {
      return null;
    }

    const family = await familyRepository.findById(input.familyId);

    if (!family || family.deletedAt) {
      return null;
    }

    if (!(await this.ownerAccepts(family.ownerId))) {
      return null;
    }

    const actor = input.actorUserId
      ? await userRepository.findById(input.actorUserId)
      : null;

    return notificationsRepository.create({
      userId: family.ownerId,
      familyId: family.id,
      kind: "LEDGER_MOVEMENT",
      actorName: actor?.name ?? "Alguém da família",
      description: input.description,
      amount: input.amount,
      movementType: input.movementType,
    });
  }

  async recordBankMovement(input: {
    ownerUserId: string;
    familyId: string;
    plan: SubscriptionPlan;
    description: string;
    amount: number;
    movementType: MovementType;
  }) {
    if (!canNotifyBankMovement(input.plan)) {
      return null;
    }

    if (!(await this.ownerAccepts(input.ownerUserId))) {
      return null;
    }

    return notificationsRepository.create({
      userId: input.ownerUserId,
      familyId: input.familyId,
      kind: "BANK_MOVEMENT",
      actorName: null,
      description: input.description,
      amount: input.amount,
      movementType: input.movementType,
    });
  }

  async listUnread(userId: string): Promise<NoticeContract[]> {
    const notices = await notificationsRepository.findUnreadByUserId(userId);

    return notices.map((notice) => ({
      id: notice.id,
      kind: notice.kind,
      title: noticeTitle(notice.kind, notice.movementType),
      actorName: notice.actorName,
      description: notice.description,
      amount: Number(notice.amount),
      movementType: notice.movementType,
      createdAt: notice.createdAt.toISOString(),
    }));
  }

  async markReadForUser(userId: string, notificationId: string) {
    const updated = await notificationsRepository.markRead(
      notificationId,
      userId
    );

    return updated.count > 0;
  }

  private async ownerAccepts(ownerUserId: string) {
    const settings = await userSettingsRepository.findByUserId(ownerUserId);
    const level = (settings?.notificationLevel ?? "IMPORTANT") as NoticeLevel;

    return acceptsMovementNotice(level);
  }
}

export const notificationsService = new NotificationsService();
