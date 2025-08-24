// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Route modules may only export HTTP methods.
// Do NOT export authOptions etc. from here.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
