// app/dashboard/admin/halls/new/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

async function createHall(formData: FormData) {
  "use server";
  const json = (name: string) => {
    try { return JSON.parse(String(formData.get(name) || "[]")); } catch { return []; }
  };

  await prisma.hall.create({
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

export default function NewHall() {
  return (
    <>
      <h1 className="text-xl font-bold mb-4">قاعة جديدة</h1>
      <form action={createHall} className="card p-5 grid gap-3 md:grid-cols-3">
        <label className="field"><span className="label">المعرف (slug)</span><input name="slug" className="input" required /></label>
        <label className="field"><span className="label">الاسم</span><input name="name" className="input" required /></label>
        <label className="field"><span className="label">المدينة</span><input name="city" className="input" required /></label>
        <label className="field"><span className="label">الحي/المنطقة</span><input name="area" className="input" /></label>
        <label className="field"><span className="label">رجال</span><input name="menCapacity" type="number" className="input" defaultValue={0} /></label>
        <label className="field"><span className="label">نساء</span><input name="womenCapacity" type="number" className="input" defaultValue={0} /></label>
        <label className="field"><span className="label">سعر الإيجار</span><input name="basePrice" type="number" className="input" defaultValue={0} /></label>
        <label className="field md:col-span-3">
          <span className="label">الفترات (JSON array)</span>
          <input name="sessions" className="input" placeholder='["morning","evening","full"]' />
        </label>
        <label className="field md:col-span-3">
          <span className="label">المرافق (JSON array)</span>
          <input name="amenities" className="input" placeholder='["parking","lighting"]' />
        </label>
        <label className="field md:col-span-3">
          <span className="label">الصور (JSON array)</span>
          <input name="images" className="input" placeholder='["https://...","https://..."]' />
        </label>
        <label className="field"><span className="label">Lat</span><input name="lat" className="input" /></label>
        <label className="field"><span className="label">Lng</span><input name="lng" className="input" /></label>
        <div className="md:col-span-3"><button className="btn btn-primary">حفظ</button></div>
      </form>
    </>
  );
}
