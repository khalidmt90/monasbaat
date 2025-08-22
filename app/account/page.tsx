// app/account/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Always run effect hooks at top-level
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login?next=/account");
    }
  }, [status, router]);

  // While we check the session, show loading UI
  if (status === "loading") {
    return (
      <section className="section">
        <div className="container">
          <div className="card p-5">جارِ التحميل...</div>
        </div>
      </section>
    );
  }

  if (!session?.user) return null;

  const role = (session.user as any).role || "USER";
  const isAdmin = role === "ADMIN";
  const isVendor = role === "VENDOR";

  return (
    <section className="section">
      <div className="container">
        <div className="card p-5">
          <h1 className="text-2xl font-bold mb-2">حسابي</h1>

          <div className="text-gray-700">
            <div>
              <b>البريد:</b> {session.user.email}
            </div>
            <div>
              <b>الاسم:</b> {session.user.name || "—"}
            </div>
            <div>
              <b>الدور:</b> {role}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {isVendor && (
              <Link href="/dashboard/vendors" className="btn btn-ghost">
                لوحة المزود
              </Link>
            )}

            {isAdmin && (
              <button
                className="btn btn-ghost"
                onClick={() => router.push("/dashboard/admin")}
              >
                لوحة الإدارة
              </button>
            )}

            <button
              className="btn btn-primary"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
