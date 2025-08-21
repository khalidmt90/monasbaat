// app/403/page.tsx
export default function ForbiddenPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="card p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">403 — غير مصرح</h1>
          <p className="text-gray-600">ليست لديك الصلاحية للوصول إلى هذه الصفحة.</p>
        </div>
      </div>
    </section>
  );
}
