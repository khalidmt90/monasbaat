// app/dashboard/admin/layout.tsx
import * as React from "react";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirects if not signed in or not admin
  await requireAdmin("/dashboard/admin");

  return <div className="min-h-screen">{children}</div>;
}
