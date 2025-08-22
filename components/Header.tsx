"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur border-b border-gray-100">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/file.svg" alt="Monasbaat" width={40} height={40} />
          <span className="font-bold text-lg">مناسبات</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/halls" className="hover:underline">القاعات</Link>
          <Link href="/catering" className="hover:underline">الضيافة</Link>
          <Link href="/vendors" className="hover:underline">مزودون</Link>
          <Link href="/contact" className="hover:underline">تواصل</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="btn btn-ghost hidden sm:inline-flex">تسجيل دخول</Link>
          <Link href="/auth/register" className="btn btn-primary">انضم</Link>
        </div>
      </div>
    </header>
  );
}
