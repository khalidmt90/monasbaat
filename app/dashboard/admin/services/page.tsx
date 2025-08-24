// app/dashboard/admin/services/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type AdminServiceListItem = {
  id: string;
  title: string;
  type: string;
  price: number;
};

export default async function ServicesList() {
  const items = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">الخدمات</h1>
        <Link className="btn btn-primary" href="/dashboard/admin/services/new">خدمة جديدة</Link>
      </div>
      <div className="grid gap-3">
  {items.map((s: AdminServiceListItem) => (
          <div key={s.id} className="card p-4 flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-gray-500">{s.type} • {s.price.toLocaleString("ar-SA")} ر.س</div>
            </div>
            <Link className="btn btn-ghost" href={`/dashboard/admin/services/${s.id}`}>تعديل</Link>
          </div>
        ))}
        {items.length === 0 && <div className="text-gray-500">لا توجد خدمات بعد.</div>}
      </div>
    </>
  );
}
