import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config"
import { usersService } from "../services/users.service";
import { verifyPassword } from "./password";

export const {
  handlers,
  signIn,
  signOut,
  auth
} = NextAuth({

  ...authConfig,

  providers: [

    Credentials({

      credentials: {

        email: {
          label: "Email",
          type: "email"
        },

        password: {
          label: "Senha",
          type: "password"
        }

      },

      async authorize(credentials) {

        const email =
          credentials?.email as
            | string
            | undefined;

        const password =
          credentials?.password as
            | string
            | undefined;


        if (!email || !password) {

          return null;

        }


        const user =
          await usersService.findByEmail(
            email
          );


        if (!user) {

          return null;

        }


        if (
          user.status !== "ACTIVE"
        ) {

          return null;

        }


        if (!user.passwordHash) {

          return null;

        }


        const passwordValid =
          await verifyPassword(
            password,
            user.passwordHash
          );


        if (!passwordValid) {

          return null;

        }


        return {

          id: user.id,

          name: user.name,

          email: user.email,

          image: user.image

        };

      }

    })

  ]

});