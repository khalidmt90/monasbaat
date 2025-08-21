// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

/** Get the current session (server-side) */
export async function getSession() {
  return getServerSession(authOptions);
}

/** Require an authenticated admin; otherwise redirect to login with ?next=... */
export async function requireAdmin(nextPath?: string) {
  const session = await getSession();
  if (!session) {
    redirect(`/auth/login?next=${encodeURIComponent(nextPath || "/dashboard/admin")}`);
  }
  // Optional role check (we set role=admin in jwt/session callbacks)
  if ((session as any).role !== "admin") {
    redirect("/");
  }
  return session;
}
