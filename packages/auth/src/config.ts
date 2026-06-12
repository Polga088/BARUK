import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@repo/database";
import type { SessionUser } from "./types";

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }

  interface User extends SessionUser {
    passwordHash?: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) },
        });

        if (!user?.passwordHash || !user.isActive) {
          return null;
        }

        const valid = await compare(
          String(credentials.password),
          user.passwordHash,
        );

        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.organizationId = user.organizationId;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email!,
          name: token.name!,
          role: token.role as SessionUser["role"],
          organizationId: token.organizationId as string | null,
        },
      };
    },
  },
});
