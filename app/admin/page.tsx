// app/admin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function AdminHome() {
  const router = useRouter();
  const { user, loading, role, status } = useAuth();

  useEffect(() => {
    if (loading) return; // wait for session
    if (status === "unauthenticated" || !user) {
      router.replace("/auth/login?next=/admin");
      return;
    }
    if (role !== "admin") {
      router.replace("/");
    }
  }, [loading, status, user, role, router]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (!user || role !== "admin") return <p className="p-6">Redirecting…</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">اللوحة الرئيسية (Admin)</h1>
      <p className="text-sm text-gray-600">مرحبًا، {user.email}</p>
    </main>
  );
}
