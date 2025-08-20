// app/confirm/page.tsx
import Link from "next/link";

export default function ConfirmPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const holdHours = 48;

  const hall = searchParams.hall || "";
  const start = searchParams.start || "";
  const end = searchParams.end || start || "";
  const days = searchParams.days || "1";
  const session = searchParams.session || "";
  const men = searchParams.men || "0";
  const women = searchParams.women || "0";
  const addons = (searchParams.addons || "").split(",").filter(Boolean);
  const name = searchParams.name || "";
  const phone = searchParams.phone || "";
  const email = searchParams.email || "";

  return (
    <section className="section">
      <div className="container">
        <h1 className="text-2xl font-bold mb-2">تم إنشاء طلب الحجز بنجاح</h1>
        <p className="text-gray-600 mb-4">رقم الطلب أُرسل إلى جوالك/بريدك (عند توفره). لديك <b>{holdHours} ساعة</b> لإتمام التحويل البنكي.</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="font-bold mb-2">تفاصيل الحجز</h3>
            <div className="text-sm space-y-1">
              <div><b>القاعة:</b> {hall || "—"}</div>
              <div><b>الفترة:</b> {session || "—"}</div>
              <div><b>التواريخ:</b> {start || "—"} → {end || "—"} ({days} يوم)</div>
              <div><b>الأعداد:</b> رجال {men} • نساء {women}</div>
              <div><b>الإضافات:</b> {addons.length ? addons.join("، ") : "لا يوجد"}</div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-bold mb-2">خطوات الدفع</h3>
            <ol className="list-decimal pr-5 text-sm space-y-1">
              <li>حوّل المبلغ الموضح في عرض السعر إلى الحساب البنكي الذي سيصلك عبر رسالة.</li>
              <li>احتفظ بإيصال التحويل.</li>
              <li>عُد إلى حسابك وارفع الإيصال ليتم التحقق خلال 24–48 ساعة.</li>
            </ol>
            <div className="text-xs text-gray-500 mt-2">
              * إذا انتهت مهلة <b>{holdHours} ساعة</b> دون تحويل، قد تُلغى أولوية الحجز تلقائياً.
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link href="/halls" className="btn btn-ghost">متابعة التصفح</Link>
          <Link href="/account" className="btn btn-primary">إدارة حجوزاتي</Link>
        </div>
      </div>
    </section>
  );
}
