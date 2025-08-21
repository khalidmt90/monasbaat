// app/account/page.tsx
"use client";
import { withAuth } from "@/components/withAuth";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

function Page() {
  const { user, logout } = useAuth();
  return (
    <section className="section">
      <div className="container">
        <div className="card p-5">
          <h1 className="text-2xl font-bold mb-2">حسابي</h1>
          <div className="text-gray-700">
            <div><b>الاسم:</b> {user?.name}</div>
            <div><b>الجوال:</b> {user?.phone}</div>
            <div><b>الدور:</b> {user?.role}</div>
          </div>
          <div className="flex gap-2 mt-4">
            {user?.role === "vendor" && <Link href="/vendor/dashboard" className="btn btn-ghost">لوحة المزود</Link>}
            <button className="btn btn-primary" onClick={logout}>تسجيل الخروج</button>
          </div>
        </div>
      </div>
    </section>
  );
}
export default withAuth(Page);
