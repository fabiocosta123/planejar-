import { prisma } from "../lib/prisma";



export class AccountsRepository {

  private normalizeAccount(account: any) {

    return {
      ...account,
      initialBalance:
        Number(account.initialBalance)
    };

  }

  async findById(
    id: string
  ) {

    const account =
      await prisma.account.findUnique({
        where: {
          id
        }
      });


    if (!account) {
      return null;
    }


    return this.normalizeAccount(account);

  }



  async findByFamilyMember(
    familyMemberId: string
  ) {

    const accounts =
      await prisma.account.findMany({

        where: {
          familyMemberId
        },

        orderBy: {
          displayOrder: "asc"
        }

      });


    return accounts.map(
      account =>
        this.normalizeAccount(account)
    );

  }

async create(
  data: {
    familyMemberId: string;
    name: string;
    type:
      | "CHECKING"
      | "SAVINGS"
      | "CASH"
      | "INVESTMENT"
      | "OTHER";
    initialBalanceDate: Date;
    initialBalance: number;
    isDefault?: boolean;
  }
) {

  const account =
    await prisma.account.create({

      data: {

        name: data.name,

        type: data.type,

        initialBalanceDate:
          data.initialBalanceDate,

        initialBalance:
          data.initialBalance,

        isDefault:
          data.isDefault ?? false,

        familyMember: {

          connect: {

            id: data.familyMemberId
          }
        }
      }
    });


  return this.normalizeAccount(account);

}

  async setDefault(familyMemberId: string, accountId: string) {
    return prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({
        where: {
          id: accountId,
          familyMemberId,
          deletedAt: null,
          isActive: true,
        },
      });

      if (!account) {
        return 0;
      }

      await tx.account.updateMany({
        where: {
          familyMemberId,
          deletedAt: null,
        },
        data: {
          isDefault: false,
        },
      });

      await tx.account.update({
        where: {
          id: accountId,
        },
        data: {
          isDefault: true,
        },
      });

      return 1;
    });
  }


}


export const accountsRepository =
  new AccountsRepository();