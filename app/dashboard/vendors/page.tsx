"use client";
import { Item, Stagger } from "@/components/Animated";
import Link from "next/link";

export default function VendorsHome() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-3">نظرة عامة</h1>
      <Stagger>
        <div className="grid md:grid-cols-3 gap-3">
          <Item><div className="card p-4"><b>حجوزات جديدة</b><div className="text-gray-600">0 خلال 7 أيام</div></div></Item>
          <Item><div className="card p-4"><b>مشاهدات القاعة</b><div className="text-gray-600">—</div></div></Item>
          <Item><div className="card p-4"><b>متوسط تقييم</b><div className="text-gray-600">—</div></div></Item>
        </div>
      </Stagger>

      <div className="card p-4 mt-3 text-sm text-gray-600">
        أكمل إعداد قوائمك من <Link className="text-[#2563EB]" href="/dashboard/vendors/halls">قاعاتي</Link> و{" "}
        <Link className="text-[#2563EB]" href="/dashboard/vendors/services">الخدمات والأسعار</Link>.
      </div>
    </>
  );
}
