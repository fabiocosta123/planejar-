import "dotenv/config";

import { prisma } from "../src/lib/prisma";

async function main() {
  const userId =
    "e45cc1b4-84d5-4ff5-aca5-200ebc32dba6";

  const familyMember =
    await prisma.familyMember.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
    });

  console.log("FAMILY MEMBER:");
  console.log(familyMember);

  if (!familyMember) {
    console.log("Nenhum FamilyMember encontrado.");
    return;
  }

  const accounts =
    await prisma.account.findMany({
      where: {
        familyMemberId: familyMember.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

  console.log("\nACCOUNTS:");
  console.dir(accounts, {
    depth: null,
  });

  const transactions =
    await prisma.transaction.findMany({
      where: {
        familyMemberId: familyMember.id,
      },
      orderBy: {
        transactionDate: "asc",
      },
    });

  console.log("\nTRANSACTIONS:");
  console.dir(transactions, {
    depth: null,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });