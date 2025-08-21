"use client";

export default function VendorSettings() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-3">الإعدادات</h1>
      <div className="card p-4 grid md:grid-cols-2 gap-3">
        <label className="field">
          <span className="label">اسم المنشأة</span>
          <input className="input" defaultValue="شركة المناسبات" />
        </label>
        <label className="field">
          <span className="label">IBAN</span>
          <input className="input" placeholder="SAxx xxxx xxxx xxxx" />
        </label>
        <label className="field md:col-span-2">
          <span className="label">سياسة الإلغاء</span>
          <textarea className="input" rows={4} placeholder="اكتب السياسة..." />
        </label>
        <button className="btn btn-primary md:col-span-2">حفظ</button>
      </div>
    </>
  );
}
