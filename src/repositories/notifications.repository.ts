import { prisma } from "../lib/prisma";
import { NoticeKind, MovementType } from "../domain/notifications/movement-notice";

export class NotificationsRepository {
  async create(data: {
    userId: string;
    familyId: string;
    kind: NoticeKind;
    actorName?: string | null;
    description: string;
    amount: number;
    movementType: MovementType;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        familyId: data.familyId,
        kind: data.kind,
        actorName: data.actorName ?? null,
        description: data.description,
        amount: data.amount,
        movementType: data.movementType,
      },
    });
  }

  async findUnreadByUserId(userId: string) {
    return prisma.notification.findMany({
      where: {
        userId,
        readAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });
  }

  async markRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: {
        id,
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  }
}

export const notificationsRepository = new NotificationsRepository();
