// app/dashboard/admin/services/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";

function toJSON(v: any) { try { return JSON.stringify(v ?? []); } catch { return "[]"; } }

async function updateService(id: string, formData: FormData) {
  "use server";
  const json = (n: string) => { try { return JSON.parse(String(formData.get(n) || "[]")); } catch { return []; } };
  await prisma.service.update({
    where: { id },
    data: {
      type: String(formData.get("type") || "catering"),
      title: String(formData.get("title") || ""),
      summary: String(formData.get("summary") || ""),
      price: Number(formData.get("price") || 0),
      images: json("images"),
      tags: json("tags"),
    },
  });
  redirect("/dashboard/admin/services");
}

async function deleteService(id: string) {
  "use server";
  await prisma.service.delete({ where: { id } });
  redirect("/dashboard/admin/services");
}

export default async function EditService({ params }: { params: { id: string } }) {
  const s = await prisma.service.findUnique({ where: { id: params.id } });
  if (!s) return notFound();

  return (
    <>
      <h1 className="text-xl font-bold mb-4">تعديل خدمة</h1>
      <form action={updateService.bind(null, s.id)} className="card p-5 grid gap-3 md:grid-cols-2">
        <label className="field"><span className="label">النوع</span><input name="type" className="input" defaultValue={s.type} /></label>
        <label className="field"><span className="label">السعر</span><input name="price" type="number" className="input" defaultValue={s.price} /></label>
        <label className="field md:col-span-2"><span className="label">العنوان</span><input name="title" className="input" defaultValue={s.title} /></label>
        <label className="field md:col-span-2"><span className="label">الوصف</span><input name="summary" className="input" defaultValue={s.summary ?? ""} /></label>
        <label className="field md:col-span-2"><span className="label">الصور (JSON)</span><input name="images" className="input" defaultValue={toJSON(s.images)} /></label>
        <label className="field md:col-span-2"><span className="label">الوسوم (JSON)</span><input name="tags" className="input" defaultValue={toJSON(s.tags)} /></label>
        <div className="md:col-span-2 flex gap-2">
          <button className="btn btn-primary">حفظ</button>
          <form action={deleteService.bind(null, s.id)}>
            <button className="btn btn-danger" formAction={deleteService.bind(null, s.id)}>حذف</button>
          </form>
        </div>
      </form>
    </>
  );
}
