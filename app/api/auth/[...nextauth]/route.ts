// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { bootstrapAdmin } from "@/lib/bootstrap-admin";

// Ensure admin user exists (idempotent, safe on cold start)
await bootstrapAdmin();

// Route modules may only export HTTP methods.
// Do NOT export authOptions etc. from here.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
