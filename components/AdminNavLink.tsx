// components/AdminNavLink.tsx
"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AdminNavLink() {
  const { data } = useSession();
  const role = (data?.user as any)?.role;
  if (role !== "ADMIN") return null;
  return <Link className="nav-link" href="/dashboard/admin">لوحة الإدارة</Link>;
}
