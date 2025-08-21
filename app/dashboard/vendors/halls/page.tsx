"use client";
import Link from "next/link";

export default function VendorHalls() {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold">قاعاتي</h1>
        <button className="btn btn-primary">إضافة قاعة</button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="font-bold">قاعة الياقوت</div>
          <div className="text-gray-600 text-sm">الرياض • الازدهار • سعة 600</div>
          <div className="mt-2 flex gap-2">
            <button className="btn btn-ghost">تعديل</button>
            <Link href="/halls/al-yakout" className="btn btn-ghost">عرض</Link>
          </div>
        </div>
        <div className="card p-4">
          <div className="font-bold">قاعة الفيروز</div>
          <div className="text-gray-600 text-sm">جدة • الشاطئ • سعة 500</div>
          <div className="mt-2 flex gap-2">
            <button className="btn btn-ghost">تعديل</button>
            <Link href="/halls/al-fayrouz" className="btn btn-ghost">عرض</Link>
          </div>
        </div>
      </div>
    </>
  );
}
