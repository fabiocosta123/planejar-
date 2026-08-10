import { prisma } from "../lib/prisma";
import { PrismaClient } from "../lib/generated/prisma/client";

type PrismaTransactionClient =
  Parameters<
    Parameters<PrismaClient["$transaction"]>[0]
  >[0];


export class FamilyRepository {

  async findById(
    id: string
  ) {

    return prisma.family.findUnique({
      where: {
        id
      }
    });

  }


  async findByOwnerId(
    ownerId: string
  ) {

    return prisma.family.findMany({
      where: {
        ownerId,
        deletedAt: null
      },

      orderBy: {
        createdAt: "asc"
      }
    });

  }


  async create(
    data: {
      name: string;
      ownerId: string;
    }
  ) {

    return prisma.family.create({
      data
    });

  }


  async createWithClient(
    client: PrismaTransactionClient,
    data: {
      name: string;
      ownerId: string;
    }
  ) {

    return client.family.create({
      data
    });

  }


  async update(
    id: string,
    data: {
      name?: string;
    }
  ) {

    return prisma.family.update({
      where: {
        id
      },
      data
    });

  }


  async delete(
    id: string
  ) {

    return prisma.family.update({
      where: {
        id
      },
      data: {
        deletedAt: new Date()
      }
    });

  }

}


export const familyRepository =
  new FamilyRepository();