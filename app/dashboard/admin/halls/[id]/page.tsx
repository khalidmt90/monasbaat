// app/dashboard/admin/halls/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";

function toJSON(v: any) {
  try { return JSON.stringify(v ?? []); } catch { return "[]"; }
}

async function updateHall(id: string, formData: FormData) {
  "use server";
  const json = (name: string) => { try { return JSON.parse(String(formData.get(name) || "[]")); } catch { return []; } };
  await prisma.hall.update({
    where: { id },
    data: {
      slug: String(formData.get("slug") || "").trim(),
      name: String(formData.get("name") || ""),
      city: String(formData.get("city") || ""),
      area: String(formData.get("area") || ""),
      menCapacity: Number(formData.get("menCapacity") || 0),
      womenCapacity: Number(formData.get("womenCapacity") || 0),
      basePrice: Number(formData.get("basePrice") || 0),
      sessions: json("sessions"),
      amenities: json("amenities"),
      images: json("images"),
      lat: formData.get("lat") ? Number(formData.get("lat")) : null,
      lng: formData.get("lng") ? Number(formData.get("lng")) : null,
    },
  });
  redirect("/dashboard/admin/halls");
}

async function deleteHall(id: string) {
  "use server";
  await prisma.hall.delete({ where: { id } });
  redirect("/dashboard/admin/halls");
}

export default async function EditHall({ params }: { params: { id: string } }) {
  const h = await prisma.hall.findUnique({ where: { id: params.id } });
  if (!h) return notFound();

  return (
    <>
      <h1 className="text-xl font-bold mb-4">تعديل قاعة</h1>
      <form action={updateHall.bind(null, h.id)} className="card p-5 grid gap-3 md:grid-cols-3">
        <label className="field"><span className="label">المعرف (slug)</span><input name="slug" className="input" defaultValue={h.slug} /></label>
        <label className="field"><span className="label">الاسم</span><input name="name" className="input" defaultValue={h.name} /></label>
        <label className="field"><span className="label">المدينة</span><input name="city" className="input" defaultValue={h.city} /></label>
        <label className="field"><span className="label">الحي</span><input name="area" className="input" defaultValue={h.area ?? ""} /></label>
        <label className="field"><span className="label">رجال</span><input name="menCapacity" type="number" className="input" defaultValue={h.menCapacity} /></label>
        <label className="field"><span className="label">نساء</span><input name="womenCapacity" type="number" className="input" defaultValue={h.womenCapacity} /></label>
        <label className="field"><span className="label">سعر الإيجار</span><input name="basePrice" type="number" className="input" defaultValue={h.basePrice} /></label>
        <label className="field md:col-span-3"><span className="label">الفترات (JSON)</span><input name="sessions" className="input" defaultValue={toJSON(h.sessions)} /></label>
        <label className="field md:col-span-3"><span className="label">المرافق (JSON)</span><input name="amenities" className="input" defaultValue={toJSON(h.amenities)} /></label>
        <label className="field md:col-span-3"><span className="label">الصور (JSON)</span><input name="images" className="input" defaultValue={toJSON(h.images)} /></label>
        <label className="field"><span className="label">Lat</span><input name="lat" className="input" defaultValue={h.lat ?? ""} /></label>
        <label className="field"><span className="label">Lng</span><input name="lng" className="input" defaultValue={h.lng ?? ""} /></label>
        <div className="md:col-span-3 flex gap-2">
          <button className="btn btn-primary">حفظ</button>
          <form action={deleteHall.bind(null, h.id)}>
            <button className="btn btn-danger" formAction={deleteHall.bind(null, h.id)}>حذف</button>
          </form>
        </div>
      </form>
    </>
  );
}
