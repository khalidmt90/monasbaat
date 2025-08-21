// app/dashboard/admin/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/auth/login?next=/dashboard/admin");
      return;
    }

    if ((session as any).role !== "admin" && (session.user as any)?.role !== "admin") {
      router.replace("/");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") return <p className="p-6">Loading…</p>;
  if (!session) return <p className="p-6">Redirecting…</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">لوحة التحكم</h1>
      <p className="text-sm text-gray-600">مرحبًا، {session.user?.email}</p>
    </main>
  );
}
