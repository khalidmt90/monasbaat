"use client";
import { useCart } from "@/components/CartProvider";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage(){
  const { items, total, removeItem, clear } = useCart();
  const vat = Math.round(total * 0.15);
  const grand = total + vat;
  async function confirm(){
    try {
  const payload = { customer: {}, context: { mode: 'web', deliveryMethod: 'HOME' }, lineItems: items.map(i=> ({ kind: ((i as any).vendorId==='dhabaeh' || i.id?.startsWith?.('dh-') || i.title?.toLowerCase?.().includes('ذبايح'))? 'dhabaeh' : 'hall_slot', title: i.title, qty: i.qty||1, price: i.price, meta: i.meta })) , totals: { total }, agreements: { termsAccepted: true, locale: 'ar' } };
      const res = await fetch('/api/checkout/create-order',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if(!res.ok) throw 0;
      const data = await res.json();
      clear();
      const ref = data.order_ref || data.order_id || (data.order && data.order.id);
      window.location.href = '/success?order='+encodeURIComponent(ref);
    } catch (err) {
      console.error(err);
      alert('تعذر إنشاء الطلب حالياً');
    }
  }
  return (
    <section className="section">
      <div className="container max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">الدفع</h1>
        {items.length===0 && <div className="card p-6 text-center">السلة فارغة — <Link href="/halls" className="text-primary">استعرض القاعات</Link></div>}
        <div className="space-y-3">
          {items.map(i=> (
            <div key={i.id} className="card p-4 flex items-center gap-3 justify-between">
              <div className="text-sm">
                <div className="font-medium">{i.title}</div>
                <div className="text-gray-500">{i.meta}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-bold text-sm whitespace-nowrap">{formatPrice(i.price)} ر.س</div>
                <button onClick={()=>removeItem(i.id)} className="btn btn-ghost !p-2" aria-label="حذف"><i className="fa-solid fa-xmark" /></button>
              </div>
            </div>
          ))}
        </div>
        {items.length>0 && (
          <div className="mt-6 card p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>المجموع</span><b>{formatPrice(total)} ر.س</b></div>
            <div className="flex justify-between"><span>الضريبة (15%)</span><b>{formatPrice(vat)} ر.س</b></div>
            <div className="flex justify-between font-bold border-t border-dashed pt-2"><span>الإجمالي</span><b>{formatPrice(grand)} ر.س</b></div>
            <button className="btn btn-primary w-full mt-2" onClick={confirm}>تأكيد الطلب (تحويل بنكي)</button>
          </div>
        )}
      </div>
    </section>
  );
}