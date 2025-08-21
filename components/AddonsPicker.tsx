"use client";

import { useState } from "react";
import Link from "next/link";

export type ServiceLite = {
  id: string;
  title: string;
  vendor: string;
  priceFrom: number;
  kind: string;
};

export default function AddonsPicker({
  hallId,
  services,
}: {
  hallId: string;
  services: ServiceLite[];
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );

  const goNext = (withAddons: boolean) => {
    const base = `/book/${hallId}`;
    const url = withAddons && selected.length
      ? `${base}?addons=${encodeURIComponent(selected.join(","))}`
      : base;
    window.location.href = url;
  };

  return (
    <div className="card p-4">
      <h3 className="font-bold mb-3">أضف خدمات مكملة</h3>

      <div className="grid grid-cols-1 gap-2">
        {services.map((s) => (
          <label
            key={s.id}
            className="p-3 rounded-lg border flex items-center justify-between gap-3 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selected.includes(s.id)}
                onChange={() => toggle(s.id)}
              />
              <div>
                <div className="font-bold">{s.title}</div>
                <div className="text-gray-500 text-sm">
                  {s.vendor} • ابتداءً من {s.priceFrom.toLocaleString("ar-SA")} ر.س
                </div>
              </div>
            </div>
            <Link href={`/${s.kind}`} className="text-[#2563EB] text-sm hover:underline">
              تفاصيل
            </Link>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 mt-3">
        <button className="btn btn-primary w-full" onClick={() => goNext(true)}>
          متابعة الحجز
        </button>
        <button className="btn btn-ghost w-full" onClick={() => goNext(false)}>
          متابعة بدون إضافات
        </button>
      </div>
    </div>
  );
}
