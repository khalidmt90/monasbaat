// components/home/StickyShowcase.tsx
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function StickyShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // three “slides” fading/scaling in sequence
  const o1 = useTransform(scrollYProgress, [0.00, 0.15, 0.33], [1, 1, 0]);
  const s1 = useTransform(scrollYProgress, [0.00, 0.15], [1, 0.95]);
  const o2 = useTransform(scrollYProgress, [0.20, 0.40, 0.66], [0, 1, 0]);
  const s2 = useTransform(scrollYProgress, [0.20, 0.40], [0.95, 1]);
  const o3 = useTransform(scrollYProgress, [0.50, 0.75, 1.00], [0, 1, 1]);
  const s3 = useTransform(scrollYProgress, [0.50, 0.75], [0.95, 1]);

  return (
    <section className="relative h-[240vh] section bg-[linear-gradient(180deg,#fff,rgba(200,200,200,0.08))]" ref={ref}>
      <div className="sticky top-[72px]">
        <div className="container">
          <motion.div style={{ opacity: o1, scale: s1 }} className="card p-6 md:p-10 text-center min-h-[46vh] md:min-h-[52vh] grid place-items-center">
            <div>
              <h3 className="text-2xl md:text-4xl font-extrabold">تسعير فوري — لا مفاجآت</h3>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                اختر المدينة، التاريخ، الفترة، أعداد الرجال/النساء، وسترى التكلفة التقريبية المتوقعة مع الضريبة ورسوم المنصة.
              </p>
              <Link href="/halls" className="btn btn-primary mt-4">جرّب الآن</Link>
            </div>
          </motion.div>

          <motion.div style={{ opacity: o2, scale: s2 }} className="card p-6 md:p-10 text-center min-h-[46vh] md:minh-[52vh] grid place-items-center">
            <div>
              <h3 className="text-2xl md:text-4xl font-extrabold">سلة موحّدة للخدمات</h3>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                أضف ديكور، تصوير (رجال/نساء)، ضيافة، قهوة — ثم أكمل الطلب دفعة واحدة وتحويل بنكي بمهلة 24–72 ساعة.
              </p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                <Link href="/decor" className="btn btn-ghost">الديكور</Link>
                <Link href="/photography" className="btn btn-ghost">التصوير</Link>
                <Link href="/catering" className="btn btn-ghost">الضيافة</Link>
              </div>
            </div>
          </motion.div>

          <motion.div style={{ opacity: o3, scale: s3 }} className="card p-6 md:p-10 text-center min-h-[46vh] md:min-h-[52vh] grid place-items-center">
            <div>
              <h3 className="text-2xl md:text-4xl font-extrabold">حلول الشركات</h3>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                فعاليات الشركات، المؤتمرات، التدريب — عروض مخصّصة وفواتير رسمية (ضريبة/سجل تجاري).
              </p>
              <Link href="/corporate" className="btn btn-primary mt-4">طلب عرض شركة</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
