// app/halls/[slug]/not-found.tsx
export default function HallNotFound() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="font-bold text-lg mb-2">القاعة غير موجودة</h2>
        <p className="text-gray-600">تأكد من الرابط أو عُد إلى قائمة القاعات.</p>
        <a href="/halls" className="btn btn-primary mt-3">العودة إلى القاعات</a>
      </div>
    </section>
  );
}
