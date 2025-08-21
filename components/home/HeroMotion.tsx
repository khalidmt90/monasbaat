// components/home/HeroMotion.tsx
"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroMotion() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  return (
    <section ref={ref} className="relative">
      <motion.div
        style={{ scale, y, opacity }}
        className="relative overflow-hidden"
      >
        <div
          className="h-[72vh] md:h-[84vh] bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop)",
          }}
        >
          <div className="relative h-full bg-black/30">
            <div className="container h-full grid items-center">
              <div className="max-w-2xl text-white">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-3 py-1 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  منصة سعودية — حجوزات القاعات والخدمات
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mt-4">
                  مناسبات — احجز القاعة والخدمات في سلة واحدة
                </h1>
                <p className="text-white/90 mt-3">
                  قاعات مع أقسام رجال/نساء، تسعير فوري، إضافة ديكور/تصوير/ضيافة/قهوة، ثم تأكيد الحجز بسهولة.
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  <Link href="/halls" className="btn btn-primary">
                    ابدأ بالبحث عن قاعة
                  </Link>
                  <Link href="/photography" className="btn btn-ghost">
                    تصفح مزودي التصوير
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* subtle gradient bottom to transition */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
