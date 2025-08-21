// app/dashboard/admin/layout.tsx
import * as React from "react";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin("/dashboard/admin");
  return <div className="min-h-screen">{children}</div>;
}
