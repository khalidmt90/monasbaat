// app/dashboard/admin/services/new/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

async function createService(formData: FormData) {
  "use server";
  const json = (name: string) => { try { return JSON.parse(String(formData.get(name) || "[]")); } catch { return []; } };
  await prisma.service.create({
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

export default function NewService() {
  return (
    <>
      <h1 className="text-xl font-bold mb-4">خدمة جديدة</h1>
      <form action={createService} className="card p-5 grid gap-3 md:grid-cols-2">
        <label className="field"><span className="label">النوع</span><input name="type" className="input" placeholder="catering/decor/photography/coffee" /></label>
        <label className="field"><span className="label">السعر</span><input name="price" type="number" className="input" defaultValue={0} /></label>
        <label className="field md:col-span-2"><span className="label">العنوان</span><input name="title" className="input" required /></label>
        <label className="field md:col-span-2"><span className="label">الوصف</span><input name="summary" className="input" /></label>
        <label className="field md:col-span-2"><span className="label">الصور (JSON)</span><input name="images" className="input" placeholder='["https://..."]' /></label>
        <label className="field md:col-span-2"><span className="label">الوسوم (JSON)</span><input name="tags" className="input" placeholder='["premium","gold"]' /></label>
        <div className="md:col-span-2"><button className="btn btn-primary">حفظ</button></div>
      </form>
    </>
  );
}
