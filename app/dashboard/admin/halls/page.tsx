// app/dashboard/admin/halls/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function HallsList() {
  const halls = await prisma.hall.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">القاعات</h1>
        <Link className="btn btn-primary" href="/dashboard/admin/halls/new">قاعة جديدة</Link>
      </div>
      <div className="grid gap-3">
  {halls.map((h: { id:string; name:string; city:string; area:string|null; menCapacity:number; womenCapacity:number; images:any }) => (
          <div key={h.id} className="card p-4 flex items-center gap-4">
            <div className="w-24 h-16 rounded bg-cover bg-center" style={{ backgroundImage: `url(${(h.images as string[] | null)?.[0] ?? ""})` }} />
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{h.name}</div>
              <div className="text-sm text-gray-500">{h.city} • {h.area ?? "—"} • سعة {h.menCapacity + h.womenCapacity}</div>
            </div>
            <Link className="btn btn-ghost" href={`/dashboard/admin/halls/${h.id}`}>تعديل</Link>
          </div>
        ))}
        {halls.length === 0 && <div className="text-gray-500">لا توجد قاعات بعد.</div>}
      </div>
    </>
  );
}
