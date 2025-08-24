"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion, motion } from "framer-motion";

const logos = ["🎥 التصوير", "🎀 الديكور", "🍽️ الضيافة", "☕ القهوة", "🎤 الصوتيات", "🚗 الفاليه"];

export default function VendorMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return; // no marquee duplication in reduced motion
    const el = ref.current;
    if (!el) return;
    el.innerHTML = el.innerHTML + el.innerHTML; // duplicate for seamless loop (50% offset animation)
  }, [reduce]);
  const Wrapper = reduce ? 'div' : motion.div;
  return (
    <section className="py-10 bg-[#0f1220] text-white overflow-hidden" dir="rtl" lang="ar">
      <div className="container">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold">شركاؤنا من مزودي الخدمات</h3>
          <p className="text-gray-300">أفضل مزودي التصوير، الضيافة، الديكور، القهوة…</p>
        </div>
        {reduce ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {logos.map((l, i) => (
              <span key={i} className="px-4 py-2 text-center rounded-xl bg-white/10 border border-white/15 text-sm md:text-base">
                {l}
              </span>
            ))}
          </div>
        ) : (
          <div className="relative">
            <Wrapper ref={ref as any} className="marquee flex whitespace-nowrap gap-6 text-xl md:text-2xl opacity-90 will-change-transform select-none">
              {logos.map((l, i) => (
                <span key={i} className="px-4 py-2 rounded-xl bg-white/15 border border-white/15 backdrop-blur-sm shadow-sm hover:bg-white/20 transition-colors">
                  {l}
                </span>
              ))}
            </Wrapper>
          </div>
        )}
      </div>
    </section>
  );
}
