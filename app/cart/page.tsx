"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, total, removeItem, clear } = useCart();

  const platformPct = 5;
  const vatPct = 15;
  const platformFee = Math.round(total * (platformPct / 100));
  const vat = Math.round((total + platformFee) * (vatPct / 100));
  const grand = total + platformFee + vat;

  return (
    <section className="section">
      <div className="container">
        <h1 className="text-2xl font-bold mb-3">سلة الحجز</h1>

        {items.length === 0 ? (
          <div className="card p-6 text-center">
            السلة فارغة. <Link href="/halls" className="text-[#2563EB]">ابدأ بالبحث عن قاعة</Link>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="space-y-2">
              {items.map((it) => (
                <div key={it.id} className="card p-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold">{it.title}</div>
                    {it.meta ? <div className="text-gray-600">{it.meta}</div> : null}
                    {it.type === "hall" ? (
                      <div className="text-gray-500 text-sm">
                        رجال {it.men} • نساء {it.women} • {it.days} يوم • {it.session}
                      </div>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatPrice(it.price)} ر.س</div>
                    <button className="btn btn-ghost btn-sm mt-1" onClick={() => removeItem(it.id)}>
                      إزالة
                    </button>
                  </div>
                </div>
              ))}
              <button className="btn btn-ghost" onClick={clear}>مسح السلة</button>
            </div>

            <aside className="card p-4 h-max sticky top-24 space-y-2 text-sm">
              <h3 className="font-bold">الملخص</h3>
              <Row label="المجموع الفرعي" value={`${formatPrice(total)} ر.س`} />
              <Row label={`رسوم المنصة (${platformPct}%)`} value={`${formatPrice(platformFee)} ر.س`} />
              <Row label={`الضريبة (${vatPct}%)`} value={`${formatPrice(vat)} ر.س`} />
              <div className="flex justify-between font-bold border-t border-dashed pt-2 mt-2">
                <span>الإجمالي</span><span>{formatPrice(grand)} ر.س</span>
              </div>
              <div className="text-xs text-gray-500">
                * الدفع حالياً <b>تحويل بنكي</b>. سيتم التواصل معك لتأكيد التوفر وإرسال تفاصيل التحويل.
              </div>
              <Link href="/confirm" className="btn btn-primary w-full mt-2">تأكيد الحجز</Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span>{label}</span><span>{value}</span></div>;
}
