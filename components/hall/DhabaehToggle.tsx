"use client";
import { useState } from "react";
import Link from "next/link";

export default function DhabaehToggle({ hallId }: { hallId: string }) {
  const [include, setInclude] = useState(false);
  return (
    <div className="mt-3 space-y-3">
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={include} onChange={e=>setInclude(e.target.checked)} />
        <span>إضافة ذبيحة تقديرية (≈ 1200 ر.س)</span>
      </label>
      <Link href={`/halls/${hallId}/book${include?"?dh=1":""}`} className="btn btn-primary w-full">
        احجز هذه القاعة
      </Link>
    </div>
  );
}