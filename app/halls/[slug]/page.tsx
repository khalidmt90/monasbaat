// app/halls/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { halls } from "@/lib/data";
import { services } from "@/lib/services";

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

  const amenitiesText = hall.amenities?.length ? hall.amenities.join(" • ") : "—";
  const totalCapacity = hall.menCapacity + hall.womenCapacity;

  return (
    <section className="section section-muted">
      <div className="container">
        <h1 className="text-2xl font-bold mb-2">{hall.name} — التفاصيل</h1>
        <p className="text-gray-600 mb-4">
          {hall.city} • {hall.area} • السعة (رجال/نساء): {hall.menCapacity} / {hall.womenCapacity} • الإجمالي: {totalCapacity}
        </p>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          {/* Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {hall.images.map((src, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src={src}
                  alt={`${hall.name} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Price / Calculator (static demo) */}
          <aside className="flex flex-col gap-3">
            <div className="card p-4 text-sm">
              <b>المرافق:</b> <span>{amenitiesText}</span>
            </div>

            <div className="card p-4">
              <h3 className="font-bold mb-2">حاسبة التكلفة (تجريبية)</h3>

              <div className="grid grid-cols-2 gap-2">
                <label className="field">
                  <span className="label">رجال</span>
                  <input className="input" type="number" defaultValue={hall.menCapacity} min={0} />
                </label>
                <label className="field">
                  <span className="label">نساء</span>
                  <input className="input" type="number" defaultValue={hall.womenCapacity} min={0} />
                </label>
              </div>

              <label className="field mt-2">
                <span className="label">الفترة</span>
                <select className="select" defaultValue={hall.sessions[0]}>
                  {hall.sessions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

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

              <div className="border-t border-dashed mt-3 pt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>إيجار القاعة</span>
                  <b>{hall.basePrice.toLocaleString("ar-SA")} ر.س</b>
                </div>
                <div className="flex justify-between">
                  <span>الضيافة (تقديري)</span>
                  <b>—</b>
                </div>
                <div className="flex justify-between">
                  <span>رسوم المنصة</span>
                  <b>5%</b>
                </div>
                <div className="flex justify-between">
                  <span>الضريبة</span>
                  <b>15%</b>
                </div>
                <div className="flex justify-between font-bold">
                  <span>الإجمالي التقريبي</span>
                  <b>—</b>
                </div>
              </div>

              <Link href={`/book/${hall.id}`} className="btn btn-primary w-full mt-3">
                احجز هذه القاعة
              </Link>
            </div>
          </aside>
        </div>

        {/* Description & add-ons */}
        <div className="mt-6 grid md:grid-cols-[1fr_360px] gap-4">
          <div className="card p-4">
            <h3 className="font-bold mb-2">الوصف</h3>
            <p className="text-gray-700">
              قاعة مجهّزة بالكامل مع مرافق مميزة: {amenitiesText}. تدعم فترات {hall.sessions.join(" / ")}.
            </p>
          </div>

          <div className="card p-4">
            <h3 className="font-bold mb-3">أضف خدمات مكملة</h3>
            <div className="grid grid-cols-1 gap-2">
              {services
                .filter((s) => s.city === hall.city)
                .map((s) => (
                  <label key={s.id} className="p-3 rounded-lg border flex items-center justify-between gap-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" name="addons" value={s.id} />
                      <div>
                        <div className="font-bold">{s.title}</div>
                        <div className="text-gray-500 text-sm">{s.vendor} • ابتداءً من {s.priceFrom.toLocaleString("ar-SA")} ر.س</div>
                      </div>
                    </div>
                    <Link href={`/${s.kind}`} className="text-[#2563EB] text-sm hover:underline">تفاصيل</Link>
                  </label>
                ))}
            </div>
            <form
              action={`/book/${hall.id}`}
              method="GET"
              onSubmit={(e) => {
                const form = e.currentTarget as HTMLFormElement;
                const checked = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="addons"]:checked')).map((i) => i.value);
                const url = new URL(form.action, window.location.origin);
                if (checked.length) url.searchParams.set("addons", checked.join(","));
                e.preventDefault();
                window.location.href = url.toString();
              }}
            >
              <button className="btn btn-primary w-full mt-3">متابعة الحجز</button>
              <Link href={`/book/${hall.id}`} className="btn btn-ghost w-full mt-2">
                متابعة بدون إضافات
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
