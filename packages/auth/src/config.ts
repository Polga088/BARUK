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

function getCookiePrefix() {
  const app = process.env.AUTH_APP_NAME ?? "default";
  return `baruk.${app}`;
}

function authCookies() {
  const prefix = getCookiePrefix();
  const secure = process.env.AUTH_URL?.startsWith("https://") ?? false;

  return {
    sessionToken: {
      name: secure ? `__Secure-${prefix}.session-token` : `${prefix}.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure,
      },
    },
    callbackUrl: {
      name: secure ? `__Secure-${prefix}.callback-url` : `${prefix}.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure,
      },
    },
    csrfToken: {
      name: secure ? `__Host-${prefix}.csrf-token` : `${prefix}.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure,
      },
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  cookies: authCookies(),
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
