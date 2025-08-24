// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

/**
 * Single source of truth for NextAuth config
 * - Prisma adapter
 * - Credentials provider
 * - Google provider (optional)
 * - JWT strategy with role propagation
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: { strategy: "jwt" },
  secret: env.NEXTAUTH_SECRET,

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: creds.email } });
        if (!user?.password) return null;
        const ok = await bcrypt.compare(creds.password, user.password);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: (user as any).role,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      // On login, carry role into the JWT
      if (user) token.role = (user as any).role ?? token.role ?? "USER";
      return token;
    },
    async session({ session, token }) {
      // Expose id + role on the client session
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role ?? "USER";
      }
      return session;
    },
  },
};

/**
 * Server-only guard. Use in server components/layouts.
 * - If not signed in → redirect to /auth/login?next=<returnUrl>
 * - If signed in but not admin → redirect to "/"
 */
export async function requireAdmin(returnUrl: string = "/dashboard/admin") {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role ?? "USER";

  if (!session) {
    redirect(`/auth/login?next=${encodeURIComponent(returnUrl)}`);
  }
  if (String(role).toLowerCase() !== "admin") {
    redirect("/");
  }

  return session;
}
