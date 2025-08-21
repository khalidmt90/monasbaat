"use client";

export default function VendorServices() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-3">الخدمات والأسعار</h1>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="font-bold">الضيافة</div>
          <div className="text-sm text-gray-600">ذهبية: 95 ر.س/فرد • فضية: 75 ر.س/فرد</div>
          <button className="btn btn-ghost mt-2">تعديل القوائم</button>
        </div>
        <div className="card p-4">
          <div className="font-bold">الديكور</div>
          <div className="text-sm text-gray-600">أساسي / ذهبي / فاخر</div>
          <button className="btn btn-ghost mt-2">تعديل الحزم</button>
        </div>
      </div>
    </>
  );
}
