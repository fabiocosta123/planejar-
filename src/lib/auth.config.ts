import type { NextAuthConfig } from "next-auth";

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

      const isDashboard =
        request.nextUrl.pathname
          .startsWith("/dashboard");

      if (isDashboard) {
        return isAuthenticated;
      }

      return true;
    },

  },

} satisfies NextAuthConfig;