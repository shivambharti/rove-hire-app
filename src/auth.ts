import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // MOCK USER: Replace this with your actual validation logic
        if (credentials.email === "admin@rove.com" && credentials.password === "123456") {
          return { id: "1", name: "HR User", email: "admin@rove.com" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});

export const { GET, POST } = handlers;