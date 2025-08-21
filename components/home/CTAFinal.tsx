// components/home/CTAFinal.tsx
import Link from "next/link";

export default function CTAFinal() {
  return (
    <section className="section">
      <div className="container">
        <div className="card p-8 md:p-10 text-center bg-gradient-to-b from-ivory to-white">
          <h3 className="text-2xl md:text-3xl font-extrabold">جاهز تبدأ؟</h3>
          <p className="text-gray-600 mt-2">
            ابحث عن القاعة المناسبة، أضف الخدمات التي تحتاجها، وأكد الحجز بلمسات بسيطة.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Link href="/halls" className="btn btn-primary">ابدأ الآن</Link>
            <Link href="/corporate" className="btn btn-ghost">حلول الشركات</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
