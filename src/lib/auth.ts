import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { signIn, signOut, handlers, auth } = NextAuth({
  providers: [Google],
});
