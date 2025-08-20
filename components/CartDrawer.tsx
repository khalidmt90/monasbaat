// components/CartDrawer.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/utils";

// Inline SVGs (no external icon CSS)
function IconCart({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 .001 3.999A2 2 0 0 0 17 18ZM3 3h1.3a1 1 0 0 1 .98.804L6 6h14a1 1 0 0 1 .96 1.276l-2 7A1 1 0 0 1 18 15H8a1 1 0 0 1-.98-.804L5.14 7H4v-.5A3.5 3.5 0 0 0 3 3Z" />
    </svg>
  );
}
function IconClose({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.225 4.811 4.811 6.225 9.586 11 4.81 15.775l1.414 1.414L11 12.414l4.775 4.775 1.414-1.414L12.414 11l4.775-4.775-1.414-1.414L11 9.586 6.225 4.81Z" />
    </svg>
  );
}

export default function MiniCartButton() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <>
      <button
        className="relative inline-flex items-center justify-center rounded-lg px-3 py-2 hover:bg-gray-100 transition"
        onClick={() => setOpen(true)}
        aria-label="فتح السلة"
        type="button"
      >
        <IconCart className="w-5 h-5 text-ink" />
        {count > 0 && (
          <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] rounded-full bg-red-600 text-white text-[11px] leading-[18px] text-center px-[4px]">
            {count}
          </span>
        )}
      </button>

      {open && <CartDrawer onClose={() => setOpen(false)} />}
    </>
  );
}

function CartDrawer({ onClose }: { onClose: () => void }) {
  const { items, removeItem, total, clear } = useCart();

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* overlay above everything */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      {/* panel (RTL opens from left; change to right-0 if you prefer) */}
      <aside
        className="fixed top-0 left-0 h-screen w-full sm:w-[420px] bg-white shadow-xl p-4 overflow-auto"
        role="dialog"
        aria-modal="true"
        aria-label="سلة الحجز"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">سلة الحجز</h3>
          <button className="rounded-lg p-2 hover:bg-gray-100" onClick={onClose} aria-label="إغلاق">
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {items.length === 0 && <div className="text-gray-500">السلة فارغة.</div>}

          {items.map((it) => (
            <div key={it.id} className="card p-3 text-sm flex items-start justify-between gap-3">
              <div>
                <div className="font-bold">{it.title}</div>
                {it.meta ? <div className="text-gray-600">{it.meta}</div> : null}
                {it.type === "hall" ? (
                  <div className="text-gray-500">
                    {it.startDate} • {it.days} يوم • {it.session} • رجال {it.men} / نساء {it.women}
                  </div>
                ) : null}
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold">{formatPrice(it.price)} ر.س</div>
                <button className="btn btn-ghost btn-sm mt-1" onClick={() => removeItem(it.id)}>
                  إزالة
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t pt-3">
          <div className="flex justify-between font-bold">
            <span>الإجمالي</span>
            <span>{formatPrice(total)} ر.س</span>
          </div>
          <div className="mt-3 flex gap-2">
            <Link href="/cart" className="btn btn-primary w-full" onClick={onClose}>
              عرض السلة
            </Link>
            <button className="btn btn-ghost" onClick={clear}>
              مسح السلة
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
