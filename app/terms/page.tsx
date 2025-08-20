export default function TermsPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="text-2xl font-bold mb-3">الشروط والأحكام</h1>
        <div className="prose max-w-none rtl:prose-p:leading-7">
          <p>باستخدامك للمنصة فإنك توافق على الشروط التالية بشكل كامل. يتم تحديد مهلة الحجز (24–72 ساعة) عبر الإدارة.</p>
          <ul className="list-disc pr-5">
            <li>تأكيد الحجز يتم بعد مراجعة إيصال التحويل.</li>
            <li>أية تغييرات تُعتمد وفق سياسات كل مزود.</li>
            <li>الرسوم قد تُحمّل على العميل أو المزود حسب الاتفاق.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
