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

        familyMember: {

          connect: {

            id: data.familyMemberId
          }
        }
      }
    });


  return this.normalizeAccount(account);

}


}


export const accountsRepository =
  new AccountsRepository();