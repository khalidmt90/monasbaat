"use client";
import { useEffect, useMemo, useState } from "react";
import type { CatalogData } from "@/lib/catalog";
import { priceDhabaeh, type DhabaehSelection } from "@/lib/pricing";

export function DhabaehMiniStep({ active, onChange, initial }: { active:boolean; onChange:(payload:{ selection:DhabaehSelection; pricing:any })=>void; initial?:DhabaehSelection }) {
  const [catalog,setCatalog]=useState<CatalogData|null>(null); const [err,setErr]=useState(false);
  const [sel,setSel]=useState<DhabaehSelection>(initial||{});
  useEffect(()=>{ if(!active||catalog) return; (async()=>{ try{ const r= await fetch('/api/catalog'); if(!r.ok) throw 0; setCatalog(await r.json()); }catch{ setErr(true);} })(); },[active,catalog]);
  const pricing = useMemo(()=> catalog? priceDhabaeh(sel,catalog): null,[sel,catalog]);
  useEffect(()=>{ if(pricing) onChange({ selection: sel, pricing }); },[pricing,sel,onChange]);
  function update<K extends keyof DhabaehSelection>(k:K,v:DhabaehSelection[K]){ setSel(s=>({...s,[k]:v})); }
  if(!active) return null;
  const animals = catalog?.animals||[]; const ages = catalog? catalog.ages.filter(a=> a.animalId===sel.animalId):[];
  return (
    <div className="mt-4 border rounded p-3 space-y-2 bg-white/60">
      <h4 className="font-bold text-sm">ذبيحة — الخطوة ١ (اختيار أساسي)</h4>
      {err && <div className="text-xs text-red-600">تعذر تحميل الكاتالوج</div>}
      <div className="grid md:grid-cols-3 gap-2">
        <label className="field"><span className="label">النوع</span><select className="select" value={sel.animalId||''} onChange={e=>update('animalId',e.target.value||undefined)} disabled={!!err}>{/* animals */}<option value="">—</option>{animals.map(a=> <option key={a.id} value={a.id}>{a.nameAr}</option>)}</select></label>
        <label className="field"><span className="label">العمر</span><select className="select" value={sel.ageId||''} onChange={e=>update('ageId',e.target.value||undefined)} disabled={!sel.animalId||!!err}><option value="">—</option>{ages.map(a=> <option key={a.id} value={a.id}>{a.nameAr}</option>)}</select></label>
        <div className="field"><span className="label">الوزن التقديري</span><input readOnly className="input" value={pricing?.estimatedWeightKg? pricing.estimatedWeightKg+" كجم":"—"} /></div>
      </div>
      <div className="text-xs text-gray-500">سيتم إكمال باقي خطوات الذبيحة لاحقاً.</div>
    </div>
  );
}
