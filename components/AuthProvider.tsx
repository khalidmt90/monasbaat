// components/AuthProvider.tsx
"use client";

import * as React from "react";
import { useSession } from "next-auth/react";

/** Roles your app recognizes. Add more if you need them. */
export type Role = "admin" | "manager" | "user";

type AuthUser = {
  email?: string | null;
  role?: Role | null;
};

type AuthContext = {
  /** NextAuth status */
  status: "loading" | "authenticated" | "unauthenticated";
  /** Back-compat for older code */
  loading: boolean;
  /** Back-compat for older code */
  user: AuthUser | null;
  /** Convenience fields */
  email: string | null;
  role: Role | null;
};

const Ctx = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // We set role into the JWT/session in NextAuth callbacks; read it defensively
  const role =
    ((session as any)?.role as Role | undefined) ??
    ((session?.user as any)?.role as Role | undefined) ??
    null;

  const value: AuthContext = {
    status,
    loading,
    user: session?.user ? { email: session.user.email, role } : null,
    email: session?.user?.email ?? null,
    role,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
