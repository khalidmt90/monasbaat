// app/dashboard/admin/banners/new/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

async function createBanner(formData: FormData) {
  "use server";
  await prisma.banner.create({
    data: {
      section: String(formData.get("section") || "home"),
      title: String(formData.get("title") || ""),
      subtitle: String(formData.get("subtitle") || ""),
      imageUrl: String(formData.get("imageUrl") || ""),
      ctaText: String(formData.get("ctaText") || ""),
      ctaHref: String(formData.get("ctaHref") || ""),
      active: formData.get("active") === "on",
      sort: Number(formData.get("sort") || 0),
    },
  });
  redirect("/dashboard/admin/banners");
}

export default function NewBanner() {
  return (
    <>
      <h1 className="text-xl font-bold mb-4">بانر جديد</h1>
      <form action={createBanner} className="card p-5 grid gap-3 md:grid-cols-2">
        <label className="field"><span className="label">القسم</span><input name="section" className="input" placeholder="home, halls, decor ..." /></label>
        <label className="field"><span className="label">الترتيب</span><input name="sort" type="number" className="input" defaultValue={0} /></label>
        <label className="field md:col-span-2"><span className="label">العنوان</span><input name="title" className="input" required /></label>
        <label className="field md:col-span-2"><span className="label">وصف قصير</span><input name="subtitle" className="input" /></label>
        <label className="field md:col-span-2"><span className="label">رابط الصورة</span><input name="imageUrl" className="input" required /></label>
        <label className="field"><span className="label">نص الزر</span><input name="ctaText" className="input" /></label>
        <label className="field"><span className="label">رابط الزر</span><input name="ctaHref" className="input" /></label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" name="active" defaultChecked /> مفعّل</label>
        <div className="md:col-span-2">
          <button className="btn btn-primary">حفظ</button>
        </div>
      </form>
    </>
  );
}
