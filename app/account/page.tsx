// app/account/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) router.replace("/auth/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="card p-5">
          <h1 className="text-2xl font-bold mb-2">حسابي</h1>

          <div className="text-gray-700">
            <div><b>الاسم:</b> {user.name}</div>
            <div><b>الجوال:</b> {user.phone}</div>
            <div><b>الدور:</b> {user.role}</div>
          </div>

          <div className="flex gap-2 mt-4">
            {user.role === "vendor" && (
              <Link href="/dashboard/vendors" className="btn btn-ghost">لوحة المزود</Link>
            )}
            {user.role === "admin" && (
              <Link href="/dashboard/admin" className="btn btn-ghost">لوحة الإدارة</Link>
            )}
            <button className="btn btn-primary" onClick={logout}>تسجيل الخروج</button>
          </div>
        </div>
      </div>
    </section>
  );
}
