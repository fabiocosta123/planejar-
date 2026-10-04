import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "./auth.config";
import { authenticationService } from "../services/authentication.service";

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

        return authenticationService.authenticate(
          email ?? "",
          password ?? ""
        );
      }

    })

  ]

});