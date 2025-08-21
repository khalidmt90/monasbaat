// components/home/ParallaxBanners.tsx
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function ParallaxBanners() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [80, -50]);

  return (
    <section className="section" ref={ref}>
      <div className="container">
        <div className="grid md:grid-cols-2 gap-4">
          <motion.article className="card overflow-hidden" style={{ y: y1 }}>
            <div
              className="h-60 md:h-80 bg-cover bg-center"
              style={{ backgroundImage: "url(https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop)" }}
            />
            <div className="p-5">
              <h3 className="font-bold text-xl">ابحث عن القاعة المثالية</h3>
              <p className="text-gray-600 mt-1">
                فلترة بالمدينة، الفترة، السعة (رجال/نساء)، مع تسعير فوري وحاسبة تكاليف.
              </p>
              <Link href="/halls" className="btn btn-primary mt-3">تصفح القاعات</Link>
            </div>
          </motion.article>

          <motion.article className="card overflow-hidden" style={{ y: y2 }}>
            <div
              className="h-60 md:h-80 bg-cover bg-center"
              style={{ backgroundImage: "url(https://images.unsplash.com/photo-1523359346063-d879354c0ea5?q=80&w=2000&auto=format&fit=crop)" }}
            />
            <div className="p-5">
              <h3 className="font-bold text-xl">أكمل التفاصيل في سلة واحدة</h3>
              <p className="text-gray-600 mt-1">
                أضف ديكور، تصوير (رجال/نساء)، ضيافة، قهوة — كلّها من مزودين فعليين ثم أكّد الحجز.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Link href="/decor" className="btn btn-ghost">الديكور</Link>
                <Link href="/photography" className="btn btn-ghost">التصوير</Link>
                <Link href="/catering" className="btn btn-ghost">الضيافة</Link>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
