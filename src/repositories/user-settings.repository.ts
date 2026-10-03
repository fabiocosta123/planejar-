import { Prisma } from "../lib/generated/prisma/client";

import { prisma } from "../lib/prisma";

import { PrismaClient } from "../lib/generated/prisma/client";


type PrismaTransactionClient =
  Parameters<
    Parameters<PrismaClient["$transaction"]>[0]
  >[0];


export class UserSettingsRepository {


  async findByUserId(
    userId: string
  ) {

    return prisma.userSettings.findUnique({
      where: {
        userId,
      },
    });

  }


  async findByUserIdWithClient(
    client: PrismaTransactionClient,
    userId: string
  ) {

    return client.userSettings.findUnique({
      where: {
        userId,
      },
    });

  }


  async create(
    userId: string
  ) {

    return prisma.userSettings.create({
      data: {
        userId,
      },
    });

  }


  async createWithClient(
    client: PrismaTransactionClient,
    userId: string
  ) {

    return client.userSettings.create({
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


  async updateCurrentFamily(
    userId: string,
    familyId: string
  ) {

    return prisma.userSettings.update({
      where: {
        userId,
      },
      data: {
        currentFamily: {
          connect: {
            id: familyId,
          },
        },
      },
    });

  }


  async updateCurrentFamilyWithClient(
    client: PrismaTransactionClient,
    userId: string,
    familyId: string
  ) {

    return client.userSettings.update({
      where: {
        userId,
      },
      data: {
        currentFamily: {
          connect: {
            id: familyId,
          },
        },
      },
    });

  }


  async delete(
    userId: string
  ) {

    return prisma.userSettings.delete({
      where: {
        userId,
      },
    });

  }

}


export const userSettingsRepository =
  new UserSettingsRepository();