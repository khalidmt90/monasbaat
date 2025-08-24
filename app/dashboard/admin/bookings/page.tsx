// app/dashboard/admin/bookings/page.tsx
import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function BookingsList() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { hall: true, user: true },
  });

  return (
    <>
      <h1 className="text-xl font-bold mb-4">الحجوزات</h1>
      <div className="card p-0 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-right">المستخدم</th>
              <th className="p-3 text-right">القاعة</th>
              <th className="p-3">التاريخ</th>
              <th className="p-3">الأيام</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">أُنشئ</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b: { id:string; date: Date; days:number; status:string; createdAt: Date; user?: { email?: string | null } | null; hall?: { name?: string | null } | null }) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.user?.email ?? "—"}</td>
                <td className="p-3">{b.hall?.name ?? "—"}</td>
                <td className="p-3 text-center">{new Date(b.date).toLocaleDateString("ar-SA")}</td>
                <td className="p-3 text-center">{b.days}</td>
                <td className="p-3 text-center">{b.status}</td>
                <td className="p-3 text-center">{new Date(b.createdAt).toLocaleDateString("ar-SA")}</td>
              </tr>
            ))}
            {bookings.length===0 && <tr><td className="p-3 text-gray-500" colSpan={6}>لا توجد حجوزات.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
