import { FadeIn } from "@/components/Animated";

export default function CorporatePage() {
  return (
    <section className="section">
      <div className="container">
        <FadeIn>
          <h1 className="text-2xl font-bold mb-2">حلول الشركات</h1>
          <p className="text-gray-600 mb-6">مناسبات للشركات: حفلات سنوية، لقاءات ربع سنوية، إطلاق منتجات. عروض رسمية وفواتير وضريبة.</p>
        </FadeIn>
        <div className="card p-5 max-w-2xl">
          <form className="grid gap-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="field"><span className="label">اسم الشركة</span><input className="input" required /></label>
              <label className="field"><span className="label">المدينة</span><input className="input" required /></label>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="field"><span className="label">رقم السجل/الرقم الضريبي</span><input className="input" /></label>
              <label className="field"><span className="label">البريد الإلكتروني</span><input className="input" type="email" required /></label>
            </div>
            <label className="field"><span className="label">نوع المناسبة</span>
              <select className="select"><option>حفل سنوي</option><option>اجتماع</option><option>تدشين</option></select>
            </label>
            <label className="field"><span className="label">عدد الحضور التقديري</span><input className="input" type="number" min={10} /></label>
            <label className="field"><span className="label">تفاصيل إضافية</span><textarea className="textarea" rows={4} /></label>
            <button className="btn btn-primary w-max"><i className="fa-regular fa-paper-plane" /> طلب عرض سعر</button>
          </form>
        </div>
      </div>
    </section>
  );
}
