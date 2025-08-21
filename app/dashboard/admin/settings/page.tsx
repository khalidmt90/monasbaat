"use client";

export default function AdminSettings() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-3">الإعدادات العامة</h1>
      <div className="card p-4 grid md:grid-cols-3 gap-3">
        <label className="field">
          <span className="label">رسوم المنصة (%)</span>
          <input className="input" type="number" defaultValue={5} />
        </label>
        <label className="field">
          <span className="label">مهلة التحويل (ساعات)</span>
          <input className="input" type="number" defaultValue={48} />
        </label>
        <label className="field">
          <span className="label">تفعيل واتساب</span>
          <select className="select"><option>غير مفعل</option><option>مفعل</option></select>
        </label>
        <button className="btn btn-primary md:col-span-3">حفظ</button>
      </div>
    </>
  );
}
