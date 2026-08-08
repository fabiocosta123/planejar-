import type { NextAuthConfig } from "next-auth";


export const authConfig = {

  pages: {
    signIn: "/login"
  },

  session: {
    strategy: "jwt"
  },

  providers: [],

  callbacks: {

    authorized({
      auth,
      request
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

    }

  }

} satisfies NextAuthConfig;