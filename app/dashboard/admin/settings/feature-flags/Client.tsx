"use client";
import { useState } from "react";

type FlagRow = { id: string; key: string; value: { enabled?: boolean } };

export default function FeatureFlagsClient({ initialFlags }: { initialFlags: FlagRow[] }) {
  const [flags,setFlags]=useState<FlagRow[]>(initialFlags);
  const [saving,setSaving]=useState(false);
  const [loading,setLoading]=useState(false);
  const refresh=async()=>{
    setLoading(true);
    const res=await fetch("/api/admin/feature-flags");
    const data=await res.json();
    setFlags(data);setLoading(false);
  };
  const toggle= (idx:number)=>{
    setFlags(f=>f.map((r,i)=> i===idx?{...r, value:{...r.value, enabled:!r.value.enabled}}:r));
  };
  const save=async()=>{
    setSaving(true);
    await fetch("/api/admin/feature-flags",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({flags})});
    setSaving(false);
    refresh();
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إعدادات الميزات</h1>
        <p className="text-muted text-sm">تفعيل / تعطيل الوحدات الأساسية (مرحلي).</p>
      </div>
      {(loading) && <div className="text-sm">تحديث…</div>}
      <div className="space-y-3">
        {flags.map((f,i)=> (
          <div key={f.id} className="flex items-center justify-between card p-4">
            <div>
              <div className="font-mono text-sm">{f.key}</div>
              <div className="text-xs text-gray-500">{f.value.enabled?"مفعل":"معطل"}</div>
            </div>
            <button onClick={()=>toggle(i)} className={`btn ${f.value.enabled?"btn-primary":"btn-ghost"}`}>{f.value.enabled?"إيقاف":"تفعيل"}</button>
          </div>
        ))}
        <div className="flex gap-3">
          <button disabled={saving} onClick={save} className="btn btn-primary disabled:opacity-50">{saving?"حفظ…":"حفظ"}</button>
          <button disabled={saving||loading} onClick={refresh} className="btn btn-ghost">تحديث</button>
        </div>
      </div>
    </div>
  );
}
