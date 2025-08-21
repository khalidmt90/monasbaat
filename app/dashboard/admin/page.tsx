"use client";

export default function AdminHome() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-3">لوحة الإدارة</h1>
      <div className="grid md:grid-cols-4 gap-3">
        <div className="card p-4"><b>قاعات قيد المراجعة</b><div className="text-gray-600">—</div></div>
        <div className="card p-4"><b>مزودون جدد</b><div className="text-gray-600">—</div></div>
        <div className="card p-4"><b>حجوزات اليوم</b><div className="text-gray-600">—</div></div>
        <div className="card p-4"><b>بلاغات/مراجعات</b><div className="text-gray-600">—</div></div>
      </div>
    </>
  );
}
