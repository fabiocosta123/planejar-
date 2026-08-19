import "dotenv/config";

import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/password";


async function main() {

  const email =
    "teste@planejamento.local";

  const password =
    "Teste@123";


  const passwordHash =
    await hashPassword(
      password
    );


  await prisma.$transaction(
    async (tx) => {      
      // USER     

      const user =
        await tx.user.upsert({

          where: {
            email
          },

          update: {

            name: "Usuário Teste",

            passwordHash,

            status: "ACTIVE"

          },

          create: {

            name: "Usuário Teste",

            email,

            passwordHash,

            status: "ACTIVE"

          }

        });
      
      // FAMILY      

      let family =
        await tx.family.findFirst({

          where: {
            ownerId: user.id,
            deletedAt: null
          },

          orderBy: {
            createdAt: "asc"
          }

        });


      if (!family) {

        family =
          await tx.family.create({

            data: {

              name: "Família Teste",

              ownerId: user.id

            }

          });

      }      
      // FAMILY MEMBER     

      const familyMember =
        await tx.familyMember.upsert({

          where: {

            familyId_userId: {

              familyId: family.id,

              userId: user.id

            }

          },

          update: {

            role: "OWNER",

            deletedAt: null

          },

          create: {

            familyId: family.id,

            userId: user.id,

            role: "OWNER"

          }

        });
      
      // USER SETTINGS      

      const settings =
        await tx.userSettings.upsert({

          where: {

            userId: user.id

          },

          update: {

            currentFamilyId:
              family.id

          },

          create: {

            userId: user.id,

            currentFamilyId:
              family.id

          }

        });
      
      // LOG     

      console.log(
        "Usuário de desenvolvimento inicializado:"
      );

      console.log({

        userId: user.id,

        email: user.email,

        familyId: family.id,

        familyMemberId:
          familyMember.id,

        currentFamilyId:
          settings.currentFamilyId

      });

    }
  );


  console.log(
    "Senha de desenvolvimento: Teste@123"
  );

}


main()

  .catch(error => {

    console.error(
      "Erro ao inicializar usuário de desenvolvimento:",
      error
    );

    process.exit(1);

  })

  .finally(async () => {

    await prisma.$disconnect();

  });