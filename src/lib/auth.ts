import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        email: {
          label: "E-mail",
          type: "email",
        },
        password: {
          label: "Senha",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        const email =
          String(credentials.email)
            .trim()
            .toLowerCase();

        const password =
          String(credentials.password);

        const user =
          await prisma.user.findUnique({
            where: {
              email,
            },
          });

        if (!user) {
          return null;
        }

        if (user.status !== "ACTIVE") {
          return null;
        }

        if (!user.passwordHash) {
          return null;
        }

        const passwordMatches =
          await bcrypt.compare(
            password,
            user.passwordHash
          );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});