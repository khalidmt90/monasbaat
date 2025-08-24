"use client";
import { useEffect, useState, useMemo } from "react";

export type HallSlotLite = { id:string; date:string; startTime:string; endTime:string; status:string; priceOverride:number|null; capacityLimit:number|null };

export function HallSlotPicker({ hallId, value, onChange }: { hallId:string; value?:string; onChange:(slotId:string)=>void }) {
  const [slots,setSlots]=useState<HallSlotLite[]>([]);
  const [error,setError]=useState(false);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ let mounted=true; (async()=>{ try{ setLoading(true); const r= await fetch(`/api/halls/${hallId}/slots`); if(!r.ok) throw 0; const data= await r.json(); if(mounted) setSlots(data);}catch{ if(mounted) setError(true);} finally{ if(mounted) setLoading(false);} })(); return ()=>{mounted=false}; },[hallId]);
  const grouped = useMemo(()=> slots.reduce<Record<string,HallSlotLite[]>>((acc,s)=>{ const d=s.date.slice(0,10); (acc[d]||(acc[d]=[])).push(s); return acc; },{}),[slots]);
  if(error) return <div className="text-sm text-red-600">تعذر تحميل المواعيد</div>;
  if(loading) return <div className="text-sm text-gray-500">جاري التحميل...</div>;
  return (
    <div className="space-y-3">
      {Object.entries(grouped).slice(0,14).map(([date,list])=> (
        <div key={date} className="space-y-2">
          <div className="text-xs font-bold text-gray-600 border-b border-dashed pb-1">{date}</div>
          <div className="flex flex-wrap gap-2">
            {list.map(s=> {
              const disabled = s.status!=='open';
              const selected = value===s.id;
              return <button key={s.id} onClick={()=>!disabled&&onChange(s.id)} disabled={disabled} className={`px-3 py-2 rounded border text-xs ${selected? 'bg-primary text-white border-primary':'bg-white hover:bg-gray-50'} ${disabled?'opacity-40 cursor-not-allowed':''}`}>{s.startTime}-{s.endTime}</button>;
            })}
          </div>
        </div>
      ))}
      {slots.length===0 && <div className="text-xs text-gray-500">لا توجد مواعيد متاحة حالياً</div>}
    </div>
  );
}
