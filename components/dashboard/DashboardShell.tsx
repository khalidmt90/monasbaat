// components/dashboard/DashboardShell.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SessionUser } from "@/components/AuthProvider";

type Props = { user: SessionUser; children: React.ReactNode };

export default function DashboardShell({ user, children }: Props) {
  const pathname = usePathname();
  const isVendor = user.role === "vendor";
  const isAdmin = user.role === "admin";

  const vendorNav = [
    { href: "/dashboard/vendors", label: "نظرة عامة", icon: "fa-gauge" },
    { href: "/dashboard/vendors/halls", label: "قاعاتي", icon: "fa-hotel" },
    { href: "/dashboard/vendors/services", label: "الخدمات والأسعار", icon: "fa-wand-magic-sparkles" },
    { href: "/dashboard/vendors/bookings", label: "الحجوزات", icon: "fa-calendar-check" },
    { href: "/dashboard/vendors/settings", label: "الإعدادات", icon: "fa-gear" },
  ];

  const adminNav = [
    { href: "/dashboard/admin", label: "لوحة الإدارة", icon: "fa-gauge-high" },
    { href: "/dashboard/admin/halls", label: "مراجعة القاعات", icon: "fa-building-columns" },
    { href: "/dashboard/admin/vendors", label: "المزودون", icon: "fa-people-roof" },
    { href: "/dashboard/admin/bookings", label: "الحجوزات", icon: "fa-clipboard-check" },
    { href: "/dashboard/admin/settings", label: "الإعدادات", icon: "fa-sliders" },
  ];

  const nav = isVendor ? vendorNav : isAdmin ? adminNav : [];

  return (
    <div className="container">
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="card p-4 h-max sticky top-24">
          <div className="font-bold text-ink">{user.name}</div>
          <div className="text-gray-500 text-sm">
            {isVendor ? "مزود" : isAdmin ? "مسؤول" : "مستخدم"}
          </div>
          <nav className="mt-4 flex flex-col">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg mb-1 flex items-center gap-2 ${
                    active ? "bg-ivory text-ink font-bold" : "hover:bg-gray-100"
                  }`}
                >
                  <i className={`fa-solid ${item.icon}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
