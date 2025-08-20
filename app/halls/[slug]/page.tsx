// app/halls/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PriceWidget from "@/components/PriceWidget";
import Gallery from "@/components/Gallery";
import { halls } from "@/lib/data";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return halls.map((h) => ({ slug: h.id }));
}

export function generateMetadata({ params }: Props) {
  const hall = halls.find((h) => h.id === params.slug);
  if (!hall) return { title: "قاعة غير موجودة — Monasbaat" };
  return {
    title: `${hall.name} — Monasbaat`,
    description: `تفاصيل ${hall.name} في ${hall.city} — ${hall.area}.`,
  };
}

export default function HallDetails({ params }: Props) {
  const hall = halls.find((h) => h.id === params.slug);
  if (!hall) return notFound();

  const addOns = [
    "كاترينغ — باقة ذهبية",
    "ديكور — باقة أساسية",
    "تصوير (رجال/نساء)",
    "قهوة وشاي — طاقم 4 ساعات",
  ];

  return (
    <section className="section section-muted">
      <div className="container">
        <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "القاعات", href: "/halls" }, { label: hall.name }]} />

        <h2 className="font-bold text-lg mb-1">{hall.name} — التفاصيل</h2>
        <p className="text-gray-600 mb-4">
          {hall.city} • {hall.area} • السعة (رجال/نساء): {hall.menCapacity} / {hall.womenCapacity}
        </p>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-4">
            <Gallery images={hall.images} />

            <div className="card p-4">
              <h3 className="font-bold mb-2">الوصف</h3>
              <p className="text-gray-700">
                قاعة مجهّزة بالكامل مع مرافق مميزة: {hall.amenities.join(" • ")}. تدعم فترات {hall.sessions.join(" / ")}.
              </p>
            </div>

            <div className="card p-4">
              <h3 className="font-bold mb-3">خدمات مكملة محتملة</h3>
              <div className="grid-4">
                {addOns.map((t, i) => (
                  <div key={i} className="card p-3">{t}</div>
                ))}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-3">
            <div className="card p-4 text-sm">
              <b>المرافق:</b> {hall.amenities.join(" • ")}
            </div>

            <div className="card p-4">
              <h3 className="font-bold mb-2">مدخلات تقديرية</h3>
              <div className="grid grid-cols-2 gap-2">
                <label className="field"><span className="label">رجال</span><input className="input" type="number" defaultValue={hall.menCapacity} min={0} /></label>
                <label className="field"><span className="label">نساء</span><input className="input" type="number" defaultValue={hall.womenCapacity} min={0} /></label>
              </div>
              <label className="field mt-2">
                <span className="label">قائمة الضيافة</span>
                <select className="select">
                  <option>ذهبية (95 ر.س/فرد)</option>
                  <option>فضية (75 ر.س/فرد)</option>
                </select>
              </label>
              <label className="inline-flex items-center gap-2 mt-2">
                <input type="checkbox" /> إضاءة خاصة (2,000 ر.س)
              </label>
            </div>

            <PriceWidget base={hall.basePrice} cateringEstimate={35100} />
            <Link href={`/book/${hall.id}`} className="btn btn-primary w-full">احجز هذه القاعة</Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
