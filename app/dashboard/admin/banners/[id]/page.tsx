// app/dashboard/admin/banners/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const revalidate = 0;

async function updateBanner(id: string, formData: FormData) {
  "use server";
  await prisma.banner.update({
    where: { id },
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

async function deleteBanner(id: string) {
  "use server";
  await prisma.banner.delete({ where: { id } });
  redirect("/dashboard/admin/banners");
}

export default async function EditBanner({ params }: { params: { id: string } }) {
  const b = await prisma.banner.findUnique({ where: { id: params.id } });
  if (!b) return notFound();

  return (
    <>
      <h1 className="text-xl font-bold mb-4">تعديل بانر</h1>
      <form action={updateBanner.bind(null, b.id)} className="card p-5 grid gap-3 md:grid-cols-2">
        <label className="field"><span className="label">القسم</span><input name="section" className="input" defaultValue={b.section} /></label>
        <label className="field"><span className="label">الترتيب</span><input name="sort" type="number" className="input" defaultValue={b.sort} /></label>
        <label className="field md:col-span-2"><span className="label">العنوان</span><input name="title" className="input" defaultValue={b.title} /></label>
        <label className="field md:col-span-2"><span className="label">وصف قصير</span><input name="subtitle" className="input" defaultValue={b.subtitle ?? ""} /></label>
        <label className="field md:col-span-2"><span className="label">رابط الصورة</span><input name="imageUrl" className="input" defaultValue={b.imageUrl} /></label>
        <label className="field"><span className="label">نص الزر</span><input name="ctaText" className="input" defaultValue={b.ctaText ?? ""} /></label>
        <label className="field"><span className="label">رابط الزر</span><input name="ctaHref" className="input" defaultValue={b.ctaHref ?? ""} /></label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={b.active} /> مفعّل</label>
        <div className="md:col-span-2 flex gap-2">
          <button className="btn btn-primary">حفظ</button>
          <form action={deleteBanner.bind(null, b.id)}>
            <button className="btn btn-danger" formAction={deleteBanner.bind(null, b.id)}>حذف</button>
          </form>
        </div>
      </form>
    </>
  );
}
