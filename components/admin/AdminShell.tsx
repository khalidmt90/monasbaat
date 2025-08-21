// components/admin/AdminShell.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NavItem = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2 text-sm ${
        active ? "bg-ink/5 text-ink font-semibold" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-[calc(100vh-68px)] grid md:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className={`border-r bg-white ${open ? "block" : "hidden md:block"}`}>
        <div className="p-4 border-b">
          <div className="font-bold">لوحة التحكم</div>
          <div className="text-xs text-gray-500">Admin</div>
        </div>
        <nav className="p-3 space-y-1">
          <NavItem href="/dashboard/admin" label="نظرة عامة" />
          <div className="text-xs uppercase text-gray-400 mt-3 mb-1">المحتوى</div>
          <NavItem href="/dashboard/admin/banners" label="البانرات" />
          <NavItem href="/dashboard/admin/halls" label="القاعات" />
          <NavItem href="/dashboard/admin/services" label="الخدمات" />
          <div className="text-xs uppercase text-gray-400 mt-3 mb-1">العملاء</div>
          <NavItem href="/dashboard/admin/bookings" label="الحجوزات" />
          <NavItem href="/dashboard/admin/users" label="المستخدمون" />
        </nav>
      </aside>

      {/* Content */}
      <div className="p-4 md:p-6">
        <div className="md:hidden mb-3">
          <button onClick={() => setOpen(!open)} className="btn btn-ghost">القائمة</button>
        </div>
        {children}
      </div>
    </div>
  );
}
