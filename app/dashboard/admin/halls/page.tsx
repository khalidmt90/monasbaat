"use client";

export default function AdminHalls() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-3">مراجعة القاعات</h1>
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold">قاعة الياقوت</div>
            <div className="text-sm text-gray-600">الرياض • الازدهار</div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary">اعتماد</button>
            <button className="btn btn-ghost">رفض</button>
          </div>
        </div>
      </div>
    </>
  );
}
