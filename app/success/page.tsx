export const metadata = { title: "تم الاستلام" };
import { Suspense } from 'react';
import { SuccessInner } from './success-inner';
export default function SuccessPage(){
  return (
    <section className="section">
      <div className="container max-w-xl text-center">
        <Suspense fallback={<div className="text-sm">...</div>}>
          <SuccessInner />
        </Suspense>
      </div>
    </section>
  );
}