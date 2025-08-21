// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/auth/login" },
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email || "").trim().toLowerCase();
        const password = credentials?.password || "";

        const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
        const adminHash = process.env.ADMIN_PASSWORD_HASH || "";

        if (!email || !password || !adminEmail || !adminHash) return null;
        if (email !== adminEmail) return null;

        const ok = await bcrypt.compare(password, adminHash);
        if (!ok) return null;

        return { id: "admin-1", email: adminEmail, role: "admin", name: "Admin" };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role ?? "admin";
      return token;
    },
    async session({ session, token }) {
      (session as any).role = token.role ?? "admin";
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always land in the admin dashboard after sign-in
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/dashboard/admin`;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
