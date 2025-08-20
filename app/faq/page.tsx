export default function FAQPage() {
  const faqs = [
    { q: "كيف يتم التسعير؟", a: "إيجار القاعة + تكلفة الضيافة لكل فرد + إضافات + ضريبة + رسوم المنصة حسب الاتفاق." },
    { q: "هل يوجد قسم رجال/نساء؟", a: "نعم، معظم القاعات توفر أقسام منفصلة مع سعات مختلفة." },
    { q: "كيف يتم الدفع؟", a: "حاليًا تحويل بنكي مع رفع إيصال التحويل. المدفوعات الإلكترونية لاحقًا." },
    { q: "هل يمكن إضافة خدمات؟", a: "نعم، كاترينغ/ديكور/تصوير/قهوة وشاي، وتظهر في الملخص." },
  ];
  return (
    <section className="section">
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">الأسئلة الشائعة</h1>
        <div className="grid gap-3">
          {faqs.map((f, i)=>(
            <details key={i} className="card p-4">
              <summary className="cursor-pointer font-bold">{f.q}</summary>
              <p className="text-gray-600 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
