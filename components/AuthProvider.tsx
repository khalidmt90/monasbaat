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

  /** Legacy registration actions expected by older pages */
  registerStart: (email: string, role?: Role) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
};

const Ctx = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // Role is injected in NextAuth callbacks; read defensively
  const role =
    ((session as any)?.role as Role | undefined) ??
    ((session?.user as any)?.role as Role | undefined) ??
    null;

  // --- No-op fallback implementations (satisfy older pages) ---
  const registerStart = React.useCallback(async (email: string, r?: Role) => {
    console.info("[AuthProvider] registerStart noop:", { email, role: r });
    // TODO: replace with real API call (e.g., POST /api/auth/register/start)
    return;
  }, []);

  const verifyOtp = React.useCallback(async (email: string, code: string) => {
    console.info("[AuthProvider] verifyOtp noop:", { email, code });
    // TODO: replace with real API call (e.g., POST /api/auth/register/verify)
    return;
  }, []);
  // ------------------------------------------------------------

  const value: AuthContext = {
    status,
    loading,
    user: session?.user ? { email: session.user.email, role } : null,
    email: session?.user?.email ?? null,
    role,
    registerStart,
    verifyOtp,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
