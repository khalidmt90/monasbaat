"use client";

import { useAuth } from "@/components/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/auth/login");
  }, [user, router]);

  if (!user) return null;

  const inAdmin = pathname.startsWith("/dashboard/admin");
  const inVendors = pathname.startsWith("/dashboard/vendors");

  if (inAdmin && user.role !== "admin") {
    router.replace("/");
    return null;
  }
  if (inVendors && user.role !== "vendor") {
    router.replace("/");
    return null;
  }

  return (
    <section className="section">
      <DashboardShell user={user}>{children}</DashboardShell>
    </section>
  );
}
