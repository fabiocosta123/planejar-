import { prisma } from "../lib/prisma";
import { Prisma } from "../lib/generated/prisma/client";

export class UserSettingsRepository {
  async findByUserId(userId: string) {
    return prisma.userSettings.findUnique({
      where: {
        userId,
      },
    });
  }

  async create(userId: string) {
    return prisma.userSettings.create({
      data: {
        userId,
      },
    });
  }

  async update(
    userId: string,
    data: Prisma.UserSettingsUpdateInput
  ) {
    return prisma.userSettings.update({
      where: {
        userId,
      },
      data,
    });
  }

  async delete(userId: string) {
    return prisma.userSettings.delete({
      where: {
        userId,
      },
    });
  }
}

export const userSettingsRepository = new UserSettingsRepository();