// app/admin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function AdminHome() {
  const router = useRouter();
  const { user, loading } = useAuth?.() ?? { user: undefined, loading: false };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <section className="section">
        <div className="container">
          <div className="card p-6">جارٍ التحقق من الصلاحيات…</div>
        </div>
      </section>
    );
  }

  const pendingHalls = 3;
  const pendingVendors = 5;
  const openBookings = 8;

  return (
    <section className="section">
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
          <div className="text-gray-500">مرحبًا، {user.name}</div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <div className="text-sm text-gray-500">قاعات بانتظار الموافقة</div>
            <div className="text-3xl font-extrabold mt-1">3</div>
            <Link href="/dashboard/admin/halls" className="btn btn-ghost mt-3">عرض</Link>
          </div>
          <div className="card p-5">
            <div className="text-sm text-gray-500">مزوّدون بانتظار التحقق</div>
            <div className="text-3xl font-extrabold mt-1">5</div>
            <Link href="/dashboard/admin/vendors" className="btn btn-ghost mt-3">عرض</Link>
          </div>
          <div className="card p-5">
            <div className="text-sm text-gray-500">حجوزات مفتوحة</div>
            <div className="text-3xl font-extrabold mt-1">8</div>
            <Link href="/dashboard/admin/bookings" className="btn btn-ghost mt-3">عرض</Link>
          </div>
        </div>

        <div className="card p-5 mt-6">
          <h2 className="font-bold text-lg mb-3">إجراءات سريعة</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Link href="/dashboard/admin/halls" className="btn btn-primary">
              <i className="fa-solid fa-building-columns" /> مراجعة القاعات
            </Link>
            <Link href="/dashboard/admin/vendors" className="btn btn-primary">
              <i className="fa-solid fa-people-roof" /> مراجعة المزودين
            </Link>
            <Link href="/dashboard/admin/bookings" className="btn btn-primary">
              <i className="fa-solid fa-clipboard-check" /> إدارة الحجوزات
            </Link>
            <Link href="/dashboard/admin/settings" className="btn btn-ghost">
              <i className="fa-solid fa-sliders" /> الإعدادات العامة
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
