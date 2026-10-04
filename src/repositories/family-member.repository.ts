import { prisma } from "../lib/prisma";
import { PrismaClient } from "../lib/generated/prisma/client";

type PrismaTransactionClient =
  Parameters<
    Parameters<PrismaClient["$transaction"]>[0]
  >[0];


export class FamilyMemberRepository {

  async findById(
    id: string
  ) {

    return prisma.familyMember.findUnique({
      where: {
        id
      }
    });

  }


  async findByUserId(
    userId: string
  ) {

    return prisma.familyMember.findMany({
      where: {
        userId,
        deletedAt: null
      },

      orderBy: {
        createdAt: "asc"
      }
    });

  }


  async findByFamilyId(
    familyId: string
  ) {

    return prisma.familyMember.findMany({
      where: {
        familyId,
        deletedAt: null
      },

      orderBy: {
        createdAt: "asc"
      }
    });

  }


  async findByFamilyAndUser(
    familyId: string,
    userId: string
  ) {

    return prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId,
          userId
        }
      }
    });

  }


  async create(
    data: {
      familyId: string;

      userId: string;

      role:
        | "OWNER"
        | "MEMBER"
        | "VIEWER";
    }
  ) {

    return prisma.familyMember.create({
      data
    });

  }


  async createWithClient(
    client: PrismaTransactionClient,
    data: {
      familyId: string;

      userId: string;

      role:
        | "OWNER"
        | "MEMBER"
        | "VIEWER";
    }
  ) {

    return client.familyMember.create({
      data
    });

  }


  async updateRole(
    id: string,
    role:
      | "OWNER"
      | "MEMBER"
      | "VIEWER"
  ) {

    return prisma.familyMember.update({

      where: {
        id
      },

      data: {
        role
      }

    });

  }


  async delete(
    id: string
  ) {

    return prisma.familyMember.update({

      where: {
        id
      },

      data: {
        deletedAt: new Date()
      }

    });

  }

}


export const familyMemberRepository =
  new FamilyMemberRepository();