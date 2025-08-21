// components/AuthProvider.tsx
"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { createContext, useContext, type ReactNode } from "react";

type AuthContext = {
  user: any | null;
  status: "loading" | "authenticated" | "unauthenticated";
  logout: () => void;
};

const Ctx = createContext<AuthContext | null>(null);

// Wrap the app with NextAuth's SessionProvider and expose a legacy-compatible context.
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthInner>{children}</AuthInner>
    </SessionProvider>
  );
}

function AuthInner({ children }: { children: ReactNode }) {
  const { data, status } = useSession();
  const value: AuthContext = {
    user: (data?.user as any) ?? null,
    status,
    logout: () => signOut({ callbackUrl: "/" }),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Legacy hook used across the codebase. Now backed by NextAuth.
export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};
