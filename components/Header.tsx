"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useScrollDirection } from "@/components/hooks/useScrollDirection";
import { useState } from "react";

export default function Header() {
  const { direction, y } = useScrollDirection();
  const [open, setOpen] = useState(false);
  const hidden = direction === "down" && y > 120;
  return (
    <motion.header
      initial={false}
      animate={{
        y: hidden ? -72 : 0,
        backdropFilter: y > 10 ? "blur(14px)" : "blur(0px)",
        backgroundColor: y > 10 ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.15)",
      }}
      transition={{ duration: 0.4, ease: [0.2, 0.9, 0.2, 1] }}
      className="fixed top-0 inset-x-0 z-50 border-b border-white/20 shadow-sm"
    >
      <div className="container flex items-center justify-between py-3 gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/file.svg" alt="Monasbaat" width={40} height={40} priority />
          <span className="font-bold text-lg tracking-tight">مناسبات</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/halls" className="nav-link">القاعات</Link>
          <Link href="/catering" className="nav-link">الضيافة</Link>
          <Link href="/vendors" className="nav-link">مزودون</Link>
          <Link href="/contact" className="nav-link">تواصل</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="btn btn-ghost hidden sm:inline-flex">تسجيل دخول</Link>
          <Link href="/auth/register" className="btn btn-primary">انضم</Link>
          <button aria-label="القائمة" className="md:hidden btn btn-ghost !p-2" onClick={() => setOpen(o => !o)}>
            <i className="fa-solid fa-bars" />
          </button>
        </div>
      </div>
      {/* mobile panel */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="md:hidden overflow-hidden bg-white/80 backdrop-blur px-4 pb-4"
      >
        <div className="flex flex-col gap-2 text-sm font-medium">
          {[
            ["/halls", "القاعات"],
            ["/catering", "الضيافة"],
            ["/vendors", "مزودون"],
            ["/contact", "تواصل"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="px-3 py-2 rounded-lg hover:bg-black/5 active:scale-[.98] transition">
              {label}
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.header>
  );
}

