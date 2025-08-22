// app/admin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession(); // status: "loading" | "authenticated" | "unauthenticated"

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/auth/login?next=/dashboard/admin");
      return;
    }

    const role = (session.user as any)?.role ?? "USER";
    if (String(role).toLowerCase() !== "admin") {
      router.replace("/");
      return;
    }
  }, [status, session, router]);

  if (status === "loading") return <p className="p-6">Loading…</p>;
  if (!session) return <p className="p-6">Redirecting…</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">لوحة التحكم</h1>
      <p className="text-sm text-gray-600">مرحبًا، {session.user?.email}</p>
    </main>
  );
}
