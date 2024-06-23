import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          const { password } = await signInSchema.parseAsync(credentials);

          if (password === process.env.ADMIN_PASSWORD) {
            return { name: "Admin" };
          }

          throw new Error("Invalid credentials.");
        } catch (error) {
          throw new Error("Invalid credentials.");
        }
      },
    }),
  ],
});
