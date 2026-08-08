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


  const user =
    await prisma.user.upsert({

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


  console.log(
    "Usuário criado/atualizado:"
  );

  console.log({
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status
  });

  console.log(
    "Senha de desenvolvimento: Teste@123"
  );

}


main()
  .catch(error => {

    console.error(
      "Erro ao criar usuário:",
      error
    );

    process.exit(1);

  })
  .finally(async () => {

    await prisma.$disconnect();

  });