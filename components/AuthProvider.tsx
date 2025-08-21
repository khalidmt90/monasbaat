// components/AuthProvider.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "user" | "vendor" | "admin";

export type SessionUser = {
  id: string;
  name: string;
  phone: string;
  role: Role;
};

type AuthCtx = {
  user: SessionUser | null;
  loginStart: (phone: string) => Promise<{ otpSent: boolean; mockCode: string }>;
  verifyOtp: (phone: string, code: string) => Promise<boolean>;
  registerStart: (payload: { name: string; phone: string; role: Role }) => Promise<{ otpSent: boolean; mockCode: string }>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("monasbaat:user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (u: SessionUser | null) => {
    if (u) localStorage.setItem("monasbaat:user", JSON.stringify(u));
    else localStorage.removeItem("monasbaat:user");
    setUser(u);
  };

  // Mock OTP store (in-memory only)
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [pendingReg, setPendingReg] = useState<{ name: string; phone: string; role: Role } | null>(null);
  const [mockCode, setMockCode] = useState<string>("");

  const loginStart = async (phone: string) => {
    const code = "123456"; // mock
    setPendingPhone(phone);
    setMockCode(code);
    return { otpSent: true, mockCode: code };
  };

  const registerStart = async ({ name, phone, role }: { name: string; phone: string; role: Role }) => {
    const code = "123456"; // mock
    setPendingReg({ name, phone, role });
    setMockCode(code);
    return { otpSent: true, mockCode: code };
  };

  const verifyOtp = async (phone: string, code: string) => {
    if (code !== mockCode) return false;

    if (pendingReg && pendingReg.phone === phone) {
      persist({
        id: `u-${Date.now()}`,
        name: pendingReg.name,
        phone: pendingReg.phone,
        role: pendingReg.role,
      });
      setPendingReg(null);
      setPendingPhone(null);
      return true;
    }

    // login existing or create minimal user
    const existing = localStorage.getItem(`monasbaat:user:${phone}`);
    if (existing) {
      const u = JSON.parse(existing) as SessionUser;
      persist(u);
      setPendingPhone(null);
      return true;
    }
    const newUser: SessionUser = { id: `u-${Date.now()}`, name: "مستخدم", phone, role: "user" };
    localStorage.setItem(`monasbaat:user:${phone}`, JSON.stringify(newUser));
    persist(newUser);
    setPendingPhone(null);
    return true;
  };

  const logout = () => persist(null);

  const value = useMemo<AuthCtx>(() => ({ user, loginStart, verifyOtp, registerStart, logout }), [user, mockCode]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};
