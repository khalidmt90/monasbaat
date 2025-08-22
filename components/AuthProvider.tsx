// components/AuthProvider.tsx
"use client";

import * as React from "react";
import { useSession } from "next-auth/react";

/** Supported roles; extend as needed. */
export type Role = "admin" | "manager" | "user";

/** Legacy registration input shape used by older pages */
export type RegisterStartInput =
  | { name: string; phone: string; role: Role }
  | string;

/** Legacy registration response shape expected by older pages */
export type RegisterStartResult = {
  otpSent: boolean;
  mockCode?: string; // for local/testing display
};

/** Legacy OTP verify response */
export type VerifyOtpResult = {
  verified: boolean;
};

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
  registerStart: (payload: RegisterStartInput) => Promise<RegisterStartResult>;
  verifyOtp: (emailOrPhone: string, code: string) => Promise<VerifyOtpResult>;
};

const Ctx = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // Role is attached in NextAuth callbacks; read defensively.
  const role: Role | null =
    ((session as any)?.role as Role | undefined) ??
    ((session?.user as any)?.role as Role | undefined) ??
    null;

  // --- No-op/mock implementations to satisfy legacy pages ---
  const registerStart = React.useCallback(
    async (payload: RegisterStartInput): Promise<RegisterStartResult> => {
      // Accept both the object form and a simple string form
      if (typeof payload === "string") {
        console.info("[AuthProvider] registerStart (string) noop:", { payload });
      } else {
        const { name, phone, role } = payload;
        console.info("[AuthProvider] registerStart (object) noop:", {
          name,
          phone,
          role,
        });
      }
      // TODO: replace with real API call, e.g.:
      // const res = await fetch("/api/auth/register/start", { method: "POST", body: JSON.stringify(payload) })
      // return await res.json();
      return { otpSent: true, mockCode: "123456" };
    },
    []
  );

  const verifyOtp = React.useCallback(
    async (emailOrPhone: string, code: string): Promise<VerifyOtpResult> => {
      console.info("[AuthProvider] verifyOtp noop:", { emailOrPhone, code });
      // TODO: replace with real API call, e.g.:
      // const res = await fetch("/api/auth/register/verify", { method: "POST", body: JSON.stringify({ emailOrPhone, code }) })
      // return await res.json();
      return { verified: code === "123456" };
    },
    []
  );
  // ---------------------------------------------------------

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
