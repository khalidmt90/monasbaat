// components/home/VendorMarquee.tsx
"use client";
import { useEffect, useRef } from "react";

const logos = [
  "🎥 التصوير",
  "🎀 الديكور",
  "🍽️ الضيافة",
  "☕ القهوة",
  "🎤 الصوتيات",
  "🚗 الفاليه",
];

export default function VendorMarquee() {
  const ref = useRef<HTMLDivElement>(null);

  // Duplicate content for seamless loop
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = el.innerHTML + el.innerHTML;
  }, []);

  return (
    <section className="py-10 bg-[#0f1220] text-white overflow-hidden">
      <div className="container">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold">شركاؤنا من مزودي الخدمات</h3>
          <p className="text-gray-300">أفضل مزودي التصوير، الضيافة، الديكور، القهوة…</p>
        </div>
        <div className="relative">
          <div ref={ref} className="marquee flex whitespace-nowrap gap-6 text-2xl opacity-90">
            {logos.map((l, i) => (
              <span key={i} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
