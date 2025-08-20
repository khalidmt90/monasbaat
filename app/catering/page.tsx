export default function CateringPage() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="font-bold text-lg mb-1">مزودو الضيافة / الكيترنغ</h2>
        <p className="text-gray-600 mb-4">قوائم لكل فرد (رجال/نساء)، باقات متنوعة.</p>
        <div className="grid-3">
          {["المذاق الفاخر","الضيافة الملكية","مطابخ النخبة"].map((t,i)=>(
            <article key={i} className="card">
              <div className="h-40 bg-center bg-cover" style={{backgroundImage:"url(https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop)"}} />
              <div className="p-4">
                <h3 className="font-bold">{t}</h3>
                <p className="text-gray-500 text-sm mt-1">قوائم من 75 ر.س/فرد</p>
                <div className="mt-2">باقة أساسية: <b>6,500</b> ر.س</div>
                <a href="#" className="btn btn-ghost mt-3">عرض الباقة</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
