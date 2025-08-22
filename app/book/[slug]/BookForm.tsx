"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/CartProvider";

export default function BookForm({ hall }: any) {
  const router = useRouter();
  const { addItem } = useCart();

  const [step, setStep] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>("");
  const [days, setDays] = useState<number>(1);
  const [session, setSession] = useState<string>("مسائية");
  const [men, setMen] = useState<number>(0);
  const [women, setWomen] = useState<number>(0);
  const [addons, setAddons] = useState<string[]>([]);
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const { id: hallId, name: hallName, city: hallCity, area: hallArea, menCapacity: menCap, womenCapacity: womenCap, basePrice, sessions } = hall;

  useEffect(() => {
    setSession(sessions[0] || "مسائية");
    setMen(Math.min(100, menCap));
    setWomen(Math.min(100, womenCap));
  }, [sessions, menCap, womenCap]);

  const endDate = useMemo(() => {
    if (!startDate || !days) return "";
    const d = new Date(startDate);
    d.setDate(d.getDate() + (days - 1));
    return d.toISOString().slice(0, 10);
  }, [startDate, days]);

  const holdHours = 48;

  function toggleAddon(id: string) {
    setAddons((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }
  function validateStep1() {
    return !!startDate && days >= 1 && men >= 0 && women >= 0 && !!session;
  }
  function nextStep() {
    if (step === 1 && !validateStep1()) return alert("أكمل بيانات التاريخ والفترة والأعداد.");
    setStep((s) => Math.min(3, s + 1));
  }
  function backStep() {
    setStep((s) => Math.max(1, s - 1));
  }
  function skipAddons() {
    setStep(3);
  }

  function handleSubmit() {
    if (!fullName || !phone) return alert("الاسم الكامل ورقم الجوال مطلوبة.");

    addItem({
      id: `hall-${hallId}-${Date.now()}`,
      type: "hall",
      hallId,
      title: `حجز ${hallName}`,
      meta: `${startDate} → ${endDate || startDate} • ${days} يوم • ${session}`,
      price: basePrice,
      qty: 1,
      startDate,
      days,
      session,
      men,
      women,
    });

    router.push("/cart");
  }

  const cateringEstimate = (men + women) * 95;
  const platformPct = 5;
  const vatPct = 15;
  const platformFee = Math.round((basePrice + cateringEstimate) * (platformPct / 100));
  const subtotal = basePrice + cateringEstimate + platformFee;
  const vat = Math.round(subtotal * (vatPct / 100));
  const total = subtotal + vat;

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "القاعات", href: "/halls" },
          { label: hallName },
          { label: "الحجز" },
        ]}
      />
      <h1 className="text-2xl font-bold mb-2">حجز — {hallName}</h1>
      <p className="text-gray-600 mb-4">
        {hallCity} • {hallArea} • السعة (رجال/نساء): {menCap}/{womenCap}
      </p>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {/* step 1 */}
          {step === 1 && (
            <div className="card p-4">
              <h3 className="font-bold mb-3">١) التاريخ والفترة والتفاصيل</h3>

              <div className="grid md:grid-cols-2 gap-3">
                <label className="field">
                  <span className="label">تاريخ البدء</span>
                  <input type="date" className="input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </label>
                <label className="field">
                  <span className="label">عدد الأيام</span>
                  <input
                    type="number"
                    min={1}
                    className="input"
                    value={days}
                    onChange={(e) => setDays(Math.max(1, Number(e.target.value || 1)))}
                  />
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mt-2">
                <label className="field">
                  <span className="label">فترة المناسبة</span>
                  <select className="select" value={session} onChange={(e) => setSession(e.target.value)}>
                    {sessions.map((s: string) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="field">
                  <span className="label">النطاق الزمني</span>
                  <input
                    className="input"
                    readOnly
                    value={endDate ? `${startDate} → ${endDate}` : startDate ? `${startDate}` : ""}
                    placeholder="—"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mt-2">
                <label className="field">
                  <span className="label">عدد الرجال</span>
                  <input
                    type="number"
                    min={0}
                    className="input"
                    value={men}
                    onChange={(e) => setMen(Math.max(0, Number(e.target.value || 0)))}
                  />
                </label>
                <label className="field">
                  <span className="label">عدد النساء</span>
                  <input
                    type="number"
                    min={0}
                    className="input"
                    value={women}
                    onChange={(e) => setWomen(Math.max(0, Number(e.target.value || 0)))}
                  />
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card p-4">
              <h3 className="font-bold mb-3">٢) اختر خدمات إضافية (اختياري)</h3>
              <p className="text-gray-600">يمكنك أيضاً استعراض مزودين فعليين وإضافة باقاتهم إلى السلة.</p>

              <div className="grid-4 mt-3">
                {[
                  { id: "decor-basic", title: "الديكور — باقة أساسية" },
                  { id: "decor-gold", title: "الديكور — باقة ذهبية" },
                  { id: "photo-men", title: "تصوير رجال" },
                  { id: "photo-women", title: "تصوير نساء" },
                  { id: "coffee-4h", title: "قهوة وشاي — 4 ساعات" },
                  { id: "catering-gold", title: "كاترينغ — باقة ذهبية" },
                ].map((a) => (
                  <label key={a.id} className="card p-3 flex gap-3 items-center cursor-pointer">
                    <input type="checkbox" checked={addons.includes(a.id)} onChange={() => toggleAddon(a.id)} />
                    <span>{a.title}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <a href="/decor" className="btn btn-ghost"><i className="fa-solid fa-wand-magic-sparkles" /> الديكور</a>
                <a href="/photography" className="btn btn-ghost"><i className="fa-solid fa-camera" /> التصوير</a>
                <a href="/catering" className="btn btn-ghost"><i className="fa-solid fa-utensils" /> الكيترنغ</a>
                <a href="/catering" className="btn btn-ghost"><i className="fa-solid fa-mug-hot" /> القهوة</a>
              </div>

              <div className="text-sm text-gray-500 mt-3">
                * المزودون طرف ثالث. تضيف باقاتهم إلى السلة وتؤكد كل شيء دفعة واحدة في صفحة السلة.
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card p-4">
              <h3 className="font-bold mb-3">٣) مراجعة وتأكيد الحجز</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="card p-3">
                  <b>القاعة:</b> <span className="text-gray-700">{hallName}</span><br />
                  <b>الفترة:</b> <span className="text-gray-700">{session}</span><br />
                  <b>التواريخ:</b> <span className="text-gray-700">{startDate || "—"} → {endDate || startDate || "—"} ({days} يوم)</span><br />
                  <b>الأعداد:</b> <span className="text-gray-700">رجال {men} • نساء {women}</span><br />
                  <b>إضافات (سريعة):</b> <span className="text-gray-700">{addons.length ? addons.join("، ") : "لا يوجد"}</span>
                </div>
                <div className="card p-3">
                  <b>ملخص تقديري:</b>
                  <div className="mt-1">إيجار القاعة: <b>{formatPrice(basePrice)} ر.س</b></div>
                  <div>الضيافة (تقديري): <b>{formatPrice(cateringEstimate)} ر.س</b></div>
                  <div>رسوم المنصة (5%): <b>{formatPrice(platformFee)} ر.س</b></div>
                  <div>الضريبة (15%): <b>{formatPrice(vat)} ر.س</b></div>
                  <div className="mt-2 font-bold">الإجمالي ≈ {formatPrice(total)} ر.س</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mt-3">
                <label className="field">
                  <span className="label">الاسم الكامل</span>
                  <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </label>
                <label className="field">
                  <span className="label">رقم الجوال</span>
                  <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>
                <label className="field">
                  <span className="label">البريد الإلكتروني (اختياري)</span>
                  <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
              </div>

              <div className="text-sm text-gray-600 mt-3">
                بالضغط على &quot;تأكيد الحجز&quot;، سنضيف القاعة إلى السلة. بعدها راجع السلة وأكمل الحجز
                (الدفع حالياً <b>تحويل بنكي</b> وبمهلة <b>{holdHours} ساعة</b>).
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {step > 1 && <button className="btn btn-ghost" onClick={backStep}>رجوع</button>}
            {step < 3 && (
              <>
                <button className="btn btn-primary" onClick={nextStep}>التالي</button>
                {step === 2 && <button className="btn btn-ghost" onClick={skipAddons}>تخطي الإضافات</button>}
              </>
            )}
            {step === 3 && (
              <button className="btn btn-primary" onClick={handleSubmit}>
                تأكيد الحجز (أضف للسلة)
              </button>
            )}
          </div>
        </div>

        <aside className="card p-4 h-max sticky top-24 space-y-2 text-sm">
          <h3 className="font-bold">الملخص السريع</h3>
          <div className="flex justify-between"><span>إيجار القاعة</span><b>{formatPrice(basePrice)} ر.س</b></div>
          <div className="flex justify-between"><span>الضيافة (تقديري)</span><b>{formatPrice(cateringEstimate)} ر.س</b></div>
          <div className="flex justify-between"><span>رسوم المنصة</span><b>5%</b></div>
          <div className="flex justify-between"><span>الضريبة</span><b>15%</b></div>
          <div className="flex justify-between font-bold border-t border-dashed pt-2 mt-2">
            <span>الإجمالي ≈</span><b>{formatPrice(total)} ر.س</b>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            * المنصة حالياً تعتمد <b>التحويل البنكي</b>. ستظهر تفاصيل التحويل بعد التأكيد من فريقنا.
          </div>
        </aside>
      </div>
    </>
  );
}
