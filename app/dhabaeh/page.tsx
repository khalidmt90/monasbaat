"use client";
export const metadata = { title: "ذبايح" };
import { useEffect, useState, useMemo } from "react";
import { priceDhabaeh, type DhabaehSelection } from "@/lib/pricing";
import type { CatalogData } from "@/lib/catalog";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";

type Step = 1|2|3|4;

export default function DhabaehPage(){
  const { addItem } = useCart();
  const [catalog,setCatalog]=useState<CatalogData|null>(null);
  const [error,setError]=useState(false);
  const [step,setStep]=useState<Step>(1);
  const [sel,setSel]=useState<DhabaehSelection>(()=>{ try{ return JSON.parse(localStorage.getItem('dhabaehDraft')||'{}'); }catch{return { deliveryTarget:"HOME" }; }});
  useEffect(()=>{ (async()=>{ try{ const r= await fetch('/api/catalog'); if(!r.ok) throw 0; setCatalog(await r.json()); }catch{ setError(true);} })(); },[]);
  useEffect(()=>{ localStorage.setItem('dhabaehDraft', JSON.stringify(sel)); },[sel]);
  const pricing = useMemo(()=> catalog? priceDhabaeh(sel,catalog): null,[sel,catalog]);
  function update<K extends keyof DhabaehSelection>(k:K,v:DhabaehSelection[K]){ setSel(s=>({...s,[k]:v})); }
  function toggleSide(id:string){ setSel(s=> ({...s, sideIds: s.sideIds?.includes(id)? s.sideIds.filter(i=>i!==id): [...(s.sideIds||[]), id]})); }
  function next(){ setStep(s=> { const n = (s+1) as number; return (n>4?4:n) as Step; }); }
  function back(){ setStep(s=> { const n = (s-1) as number; return (n<1?1:n) as Step; }); }
  function addToCart(){ if(!catalog||!pricing) return; addItem({ id:`dh-${Date.now()}`, type:'service', vendorId:'dhabaeh', packageId:'custom', title:'طلب ذبيحة', meta:`${pricing.estimatedWeightKg??'-'}كجم • ${pricing.total} ر.س`, price:pricing.total, qty:1 }); }
  const offline = error || !catalog;
  const animals = catalog?.animals || [];
  const ages = catalog? catalog.ages.filter(a=> a.animalId===sel.animalId): [];
  const cutPresets = catalog?.cutPresets || [];
  const packaging = catalog?.packaging || [];
  const cooking = catalog?.cooking || [];
  const sides = catalog?.sides || [];
  const sizeBandLabel = (()=>{ if(!pricing?.sizeBandId) return '—'; const b=catalog?.sizeBands.find(b=>b.id===pricing.sizeBandId); return b? b.labelAr : '—'; })();
  return (
    <section className="section">
      <div className="container max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">طلب ذبيحة</h1>
        <div className="mb-4 flex gap-2 text-xs">{[1,2,3,4].map(i=> <div key={i} className={`px-3 py-1 rounded-full border ${step===i?'bg-primary text-white border-primary':'bg-white'}`}>خطوة {i}</div>)}</div>
        {step===1 && <div className="card p-4 space-y-3">
          <h2 className="font-bold text-sm">١) الاختيار الأساسي</h2>
          <label className="field"><span className="label">النوع</span><select disabled={offline} className="select" value={sel.animalId||''} onChange={e=>update('animalId',e.target.value||undefined)}><option value="">—</option>{animals.map(a=> <option key={a.id} value={a.id}>{a.nameAr}</option>)}</select></label>
          {/* سلالة: سيتم إضافتها لاحقاً */}
          <label className="field"><span className="label">العمر / الأسنان</span><select disabled={offline||!sel.animalId} className="select" value={sel.ageId||''} onChange={e=>update('ageId',e.target.value||undefined)}><option value="">—</option>{ages.map(a=> <option key={a.id} value={a.id}>{a.nameAr}</option>)}</select></label>
          <div className="grid grid-cols-2 gap-3 text-sm"><div className="card p-3"><b>الحجم:</b><br />{sizeBandLabel}</div><div className="card p-3"><b>الوزن التقديري:</b><br />{pricing?.estimatedWeightKg? pricing.estimatedWeightKg+" كجم":"—"}</div></div>
        </div>}
        {step===2 && <div className="card p-4 space-y-3">
          <h2 className="font-bold text-sm">٢) المعالجات</h2>
          <label className="field"><span className="label">التقطيع</span><select disabled={offline} className="select" value={sel.cutPresetId||''} onChange={e=>update('cutPresetId',e.target.value||undefined)}><option value="">—</option>{cutPresets.map(c=> <option key={c.id} value={c.id}>{c.nameAr}</option>)}</select></label>
          <label className="field"><span className="label">التغليف</span><select disabled={offline} className="select" value={sel.packagingId||''} onChange={e=>update('packagingId',e.target.value||undefined)}><option value="">—</option>{packaging.map(c=> <option key={c.id} value={c.id}>{c.nameAr}</option>)}</select></label>
          <label className="field"><span className="label">الطبخ</span><select disabled={offline} className="select" value={sel.cookingId||''} onChange={e=>update('cookingId',e.target.value||undefined)}><option value="">—</option>{cooking.map(c=> <option key={c.id} value={c.id}>{c.nameAr}</option>)}</select></label>
          <div><div className="label mb-1">الجانبية</div><div className="flex flex-wrap gap-2">{sides.map(s=> <button key={s.id} type="button" disabled={offline} onClick={()=>toggleSide(s.id)} className={`badge px-3 py-2 rounded-full ${sel.sideIds?.includes(s.id)?'bg-primary text-white':'bg-gray-200'}`}>{s.nameAr}</button>)}</div></div>
        </div>}
        {step===3 && <div className="card p-4 space-y-3">
          <h2 className="font-bold text-sm">٣) التوصيل</h2>
          <label className="field"><span className="label">طريقة التوصيل</span><select className="select" value={sel.deliveryTarget||'HOME'} onChange={e=>update('deliveryTarget', e.target.value as any)}><option value="HOME">لمنزلي</option><option value="HALL">إلى قاعة</option></select></label>
          {sel.deliveryTarget==='HALL' && <div className="space-y-2 text-xs text-gray-600">سيتم لاحقاً عرض حجوزات القاعات المؤكدة.</div>}
        </div>}
        {step===4 && <div className="card p-4 space-y-3 text-sm">
          <h2 className="font-bold text-sm">٤) مراجعة</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="card p-3"><b>الاختيار:</b><br/>نوع: {animals.find(a=>a.id===sel.animalId)?.nameAr||'—'}<br/>العمر: {ages.find(a=>a.id===sel.ageId)?.nameAr||'—'}<br/>الوزن: {pricing?.estimatedWeightKg? pricing.estimatedWeightKg+" كجم":"—"}</div>
            <div className="card p-3"><b>السعر:</b><div>أساسي: {pricing? formatPrice(pricing.base):'—'} ر.س</div><div>إضافات: {pricing? formatPrice(pricing.modifiers):'—'} ر.س</div><div>التوصيل: {pricing? formatPrice(pricing.delivery):'—'} ر.س</div><div>ضريبة: {pricing? formatPrice(pricing.vat):'—'} ر.س</div><div className="font-bold mt-1">الإجمالي: {pricing? formatPrice(pricing.total):'—'} ر.س</div></div>
          </div>
          <button className="btn btn-primary" disabled={!pricing} onClick={addToCart}>إضافة إلى السلة</button>
        </div>}
        <div className="mt-4 flex gap-2">
          {step>1 && <button className="btn btn-ghost" onClick={back}>رجوع</button>}
          {step<4 && <button className="btn btn-primary" onClick={next}>التالي</button>}
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="card p-4 text-sm space-y-1">
            <h3 className="font-bold mb-1">السعر</h3>
            {pricing ? <>
              <div className="flex justify-between"><span>الأساسي</span><b>{formatPrice(pricing.base)} ر.س</b></div>
              <div className="flex justify-between"><span>الإضافات</span><b>{formatPrice(pricing.modifiers)} ر.س</b></div>
              <div className="flex justify-between"><span>التوصيل</span><b>{formatPrice(pricing.delivery)} ر.س</b></div>
              <div className="flex justify-between"><span>المجموع</span><b>{formatPrice(pricing.subtotal)} ر.س</b></div>
              <div className="flex justify-between"><span>الضريبة ({pricing.vatPercent}%)</span><b>{formatPrice(pricing.vat)} ر.س</b></div>
              <div className="flex justify-between font-bold border-t border-dashed pt-2"><span>الإجمالي</span><b>{formatPrice(pricing.total)} ر.س</b></div>
            </>: <div className="text-gray-500">—</div>}
          </div>
          <div className="card p-4 md:col-span-2 space-y-3">
            <h3 className="font-bold text-sm">ملاحظات</h3>
            {offline && <div className="text-xs text-red-600">لا يمكن الإضافة بدون تحميل الكاتالوج.</div>}
            <div className="text-xs text-gray-500">سيتم إضافة اختيار قاعة للتوصيل قريباً.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

