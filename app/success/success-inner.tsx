"use client";
import { useSearchParams } from 'next/navigation';
export function SuccessInner(){
  const params = useSearchParams();
  const orderId = params.get('order');
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">تم استلام طلبك ✅</h1>
      <p className="text-gray-600 mb-2">سنراجع الطلب ونتواصل معك خلال ساعات العمل.</p>
      {orderId && <div className="text-sm">رقم الطلب: <b>{orderId}</b></div>}
    </div>
  );
}