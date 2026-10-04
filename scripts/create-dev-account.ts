import "dotenv/config";

import { prisma } from "../src/lib/prisma";

async function main() {

  const userEmail =
    "teste@planejamento.local";

  const user =
    await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      include: {
        familyMembers: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: "asc",
          },
          take: 1,
        },
      },
    });

  if (!user) {
    throw new Error(
      `Usuário não encontrado: ${userEmail}`
    );
  }

  const familyMember =
    user.familyMembers[0];

  if (!familyMember) {
    throw new Error(
      "O usuário não possui FamilyMember."
    );
  }

  const existingAccount =
    await prisma.account.findFirst({
      where: {
        familyMemberId: familyMember.id,
        name: "Conta Principal",
        deletedAt: null,
      },
    });

  if (existingAccount) {

    console.log(
      "Conta de desenvolvimento já existe:"
    );

    console.log({
      id: existingAccount.id,
      familyMemberId:
        existingAccount.familyMemberId,
      name: existingAccount.name,
      initialBalance:
        Number(existingAccount.initialBalance),
    });

    return;
  }

  const account =
    await prisma.account.create({
      data: {
        familyMemberId:
          familyMember.id,

        name:
          "Conta Principal",

        description:
          "Conta criada para desenvolvimento",

        type:
          "CHECKING",

        initialBalanceDate:
          new Date(),

        initialBalance:
          1000,

        currency:
          "BRL",

        isDefault:
          true,

        isActive:
          true,
      },
    });

  console.log(
    "Conta de desenvolvimento criada:"
  );

  console.log({
    id: account.id,
    familyMemberId:
      account.familyMemberId,
    name:
      account.name,
    type:
      account.type,
    initialBalance:
      Number(account.initialBalance),
    currency:
      account.currency,
  });
}

main()
  .catch(error => {

    console.error(
      "Erro ao criar conta de desenvolvimento:",
      error
    );

    process.exit(1);

  })
  .finally(async () => {

    await prisma.$disconnect();

  });