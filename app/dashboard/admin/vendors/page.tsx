"use client";

export default function AdminVendors() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-3">إدارة المزودين</h1>
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold">شركة المناسبات</div>
            <div className="text-sm text-gray-600">CR: — • IBAN: —</div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost">تفاصيل</button>
            <button className="btn btn-primary">تفعيل</button>
          </div>
        </div>
      </div>
    </>
  );
}
