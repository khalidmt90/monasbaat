// app/dashboard/admin/users/page.tsx
import { prisma } from "@/lib/db";
export const revalidate = 0;

export default async function UsersList() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <h1 className="text-xl font-bold mb-4">المستخدمون</h1>
      <div className="card p-0 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="p-3 text-right">البريد</th><th className="p-3 text-right">الاسم</th><th className="p-3">الدور</th><th className="p-3">تاريخ الإنشاء</th></tr>
          </thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.name ?? "—"}</td>
                <td className="p-3 text-center">{u.role}</td>
                <td className="p-3 text-center">{new Date(u.createdAt).toLocaleDateString("ar-SA")}</td>
              </tr>
            ))}
            {users.length===0 && <tr><td className="p-3 text-gray-500" colSpan={4}>لا يوجد مستخدمون.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
