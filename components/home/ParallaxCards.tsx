"use client";
import Link from "next/link";
import { ParallaxBanner } from "@/components/Animated";

export default function ParallaxCards() {
  return (
    <section className="section">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-4">
          <ParallaxBanner
            image="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop"
            height="h-60 md:h-80"
          >
            <div className="p-5 md:p-6 text-white drop-shadow">
              <h3 className="font-bold text-xl">ابحث عن القاعة المثالية</h3>
              <p className="text-white/90 mt-1">فلترة بالمدينة، الفترة، السعة (رجال/نساء)، مع تسعير فوري وحاسبة تكاليف.</p>
              <Link href="/halls" className="btn btn-primary mt-3">تصفح القاعات</Link>
            </div>
          </ParallaxBanner>

          <ParallaxBanner
            image="https://images.unsplash.com/photo-1523359346063-d879354c0ea5?q=80&w=2000&auto=format&fit=crop"
            height="h-60 md:h-80"
          >
            <div className="p-5 md:p-6 text-white drop-shadow">
              <h3 className="font-bold text-xl">أكمل التفاصيل في سلة واحدة</h3>
              <p className="text-white/90 mt-1">أضف ديكور، تصوير (رجال/نساء)، ضيافة، قهوة — ثم أكّد الطلب دفعة واحدة.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Link href="/decor" className="btn btn-ghost">الديكور</Link>
                <Link href="/photography" className="btn btn-ghost">التصوير</Link>
                <Link href="/catering" className="btn btn-ghost">الضيافة</Link>
              </div>
            </div>
          </ParallaxBanner>
        </div>
      </div>
    </section>
  );
}
