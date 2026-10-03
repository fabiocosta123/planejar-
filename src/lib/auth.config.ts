import type { NextAuthConfig } from "next-auth";

const protectedPrefixes = [
  "/dashboard",
  "/transactions",
  "/accounts",
  "/settings",
];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(`${prefix}/`)
  );
}

export const authConfig = {

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  providers: [],

  callbacks: {

    async jwt({ token, user }) {

      if (user?.id) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {

      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }

      return session;
    },

    authorized({
      auth,
      request,
    }) {

      const isAuthenticated =
        !!auth?.user;

      if (
        isProtectedPath(
          request.nextUrl.pathname
        )
      ) {
        return isAuthenticated;
      }

      return true;
    },

  },

} satisfies NextAuthConfig;