// app/dashboard/admin/banners/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function BannersList() {
  const banners = await prisma.banner.findMany({ orderBy: [{ sort: "asc" }, { createdAt: "desc" }] });

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">البانرات</h1>
        <Link className="btn btn-primary" href="/dashboard/admin/banners/new">بانر جديد</Link>
      </div>

      <div className="grid gap-3">
  {banners.map((b: { id:string; imageUrl:string; title:string; section:string; active:boolean }) => (
          <div key={b.id} className="card p-4 flex items-center gap-4">
            <div className="w-24 h-16 rounded bg-cover bg-center" style={{ backgroundImage: `url(${b.imageUrl})` }} />
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{b.title}</div>
              <div className="text-sm text-gray-500">{b.section} • {b.active ? "مفعل" : "موقوف"}</div>
            </div>
            <Link className="btn btn-ghost" href={`/dashboard/admin/banners/${b.id}`}>تعديل</Link>
          </div>
        ))}
        {banners.length === 0 && <div className="text-gray-500">لا توجد بانرات بعد.</div>}
      </div>
    </>
  );
}
