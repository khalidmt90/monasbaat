export default function ReservePage() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="font-bold text-lg mb-3">إتمام الحجز</h2>
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="card p-4">
            <h3 className="font-bold">الملخص</h3>
            <ul className="list-disc pr-5 text-sm my-2">
              <li>القاعة: الياقوت — مسائية</li>
              <li>التاريخ: 1447/02/10 (تقريبي)</li>
              <li>رجال: 200 — نساء: 180</li>
              <li>الخدمات: الضيافة + التصوير</li>
            </ul>
            <div className="bg-ivory rounded-xl px-3 py-2 w-max">الإجمالي التقريبي: <b>66,274 ر.س</b></div>
            <div className="mt-4 border border-dashed rounded-xl p-3 text-sm">
              <b>سياسة الحجز:</b> التحويل البنكي خلال <b>24–72 ساعة</b>، وقد تُطبق رسوم منصة/عملاء حسب الاتفاق.
            </div>
          </div>
          <aside className="card p-4 h-max">
            <h3 className="font-bold mb-2">تعليمات الدفع (تحويل بنكي)</h3>
            <p className="text-sm text-gray-600 mb-2">سيظهر رقم الآيبان واسم المستفيد ورقم الحجز بعد الدمج مع النظام.</p>
            <label className="field">
              <span className="label">رفع إيصال التحويل</span>
              <input className="input" type="file" accept=".jpg,.jpeg,.png,.pdf" />
            </label>
            <label className="inline-flex items-center gap-2 mt-2">
              <input type="checkbox" /> أوافق على الشروط والأحكام
            </label>
            <button className="btn btn-primary w-full mt-3">إرسال الحجز</button>
          </aside>
        </div>
      </div>
    </section>
  );
}

