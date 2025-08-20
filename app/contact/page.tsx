export default function ContactPage() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="font-bold text-lg mb-3">تواصل معنا</h2>
        <form className="max-w-2xl grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <label className="field"><span className="label">الاسم</span><input className="input" required/></label>
            <label className="field"><span className="label">البريد الإلكتروني</span><input className="input" type="email" required/></label>
          </div>
          <label className="field"><span className="label">رقم الجوال</span><input className="input" type="tel"/></label>
          <label className="field"><span className="label">الرسالة</span><textarea className="textarea" rows={4} placeholder="أرسل سؤالك أو طلبك"></textarea></label>
          <button className="btn btn-primary w-max">إرسال</button>
        </form>
      </div>
    </section>
  );
}
