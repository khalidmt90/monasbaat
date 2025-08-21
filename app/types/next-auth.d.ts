// types/next-auth.d.ts (optional but nice for TS)
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    role?: "admin" | "user";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "user";
  }
}
