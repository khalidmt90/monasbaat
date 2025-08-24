"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
const DynamicDhabaehMini = dynamic(()=> import("@/components/dhabaeh/DhabaehMiniStep").then(m=> m.DhabaehMiniStep), { ssr:false, loading: () => <div className="text-xs text-gray-500">تحميل...</div> });
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/CartProvider";

export default function BookForm({ hall }: any) {
  const router = useRouter();
  const search = useSearchParams();
  const { addItem } = useCart();
  const presetDhabaeh = search.get("dh") === "1"; // from hall details toggle

  const [step, setStep] = useState<number>(1);
  const [slotId,setSlotId]=useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [days, setDays] = useState<number>(1);
  const [session, setSession] = useState<string>("مسائية");
  const [men, setMen] = useState<number>(0);
  const [women, setWomen] = useState<number>(0);
  const [addons, setAddons] = useState<string[]>(presetDhabaeh ? ["dhabaeh"] : []);
  const [dhabaehActive,setDhabaehActive]=useState<boolean>(presetDhabaeh);
  const [dhabaehSel,setDhabaehSel]=useState<any|null>(null);
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

  function toggleAddon(id: string) { setAddons((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])); }
  function toggleDhabaeh(){ setDhabaehActive(v=>!v); if(!dhabaehActive && !addons.includes('dhabaeh')) setAddons(a=>[...a,'dhabaeh']); if(dhabaehActive) setAddons(a=>a.filter(x=>x!=='dhabaeh')); }
  const onMiniChange = useCallback((p:any)=> setDhabaehSel(p),[]);
  function validateStep1() {
    return !!startDate && days >= 1 && men >= 0 && women >= 0 && !!session;
  }
  function nextStep() { setStep(s=> Math.min(4,s+1)); }
  function backStep() { setStep((s) => Math.max(1, s - 1)); }
  function skipAddons() { setStep(4); }

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
    if (dhabaehActive && dhabaehSel?.pricing) {
      const p=dhabaehSel.pricing;
      addItem({ id:`dh-${Date.now()}`, type:"service", vendorId:"dhabaeh", packageId:"custom", title:"ذبيحة", meta:`${p.estimatedWeightKg??'-'}كجم`, price:p.total, qty:1 });
    }
    router.push("/checkout");
  }

  const cateringEstimate = (men + women) * 95;
  const dhabaehPrice = dhabaehSel?.pricing?.total || 0;
  const platformPct = 5;
  const vatPct = 15;
  const platformFee = Math.round((basePrice + cateringEstimate + (dhabaehActive? dhabaehPrice:0)) * (platformPct / 100));
  const subtotal = basePrice + cateringEstimate + dhabaehPrice + platformFee;
  const vat = Math.round(subtotal * (vatPct / 100));
  const total = subtotal + vat;

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = ""; };
  }, []);

  return (
    <>
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "القاعات", href: "/halls" }, { label: hallName }, { label: "الحجز" }]} />
      <h1 className="text-2xl font-bold mb-2">حجز — {hallName}</h1>
      <p className="text-gray-600 mb-4">{hallCity} • {hallArea} • السعة (رجال/نساء): {menCap}/{womenCap}</p>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {step === 1 && (
            <div className="card p-4">
              <h3 className="font-bold mb-3">١) اختيار الموعد</h3>
              <div className="mb-3">
                <div className="label mb-1">المواعيد المتاحة</div>
                {/* placeholder for slot picker */}
                <div className="text-xs text-gray-500">ستضاف المواعيد من قاعدة البيانات لاحقاً.</div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <label className="field"><span className="label">تاريخ البدء</span><input type="date" className="input" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
                <label className="field"><span className="label">عدد الأيام</span><input type="number" min={1} className="input" value={days} onChange={(e) => setDays(Math.max(1, Number(e.target.value || 1)))} /></label>
              </div>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                <label className="field"><span className="label">فترة المناسبة</span><select className="select" value={session} onChange={(e) => setSession(e.target.value)}>{sessions.map((s: string) => <option key={s} value={s}>{s}</option>)}</select></label>
                <div className="field"><span className="label">النطاق الزمني</span><input className="input" readOnly value={endDate ? `${startDate} → ${endDate}` : startDate ? `${startDate}` : ""} placeholder="—" /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                <label className="field"><span className="label">عدد الرجال</span><input type="number" min={0} className="input" value={men} onChange={(e) => setMen(Math.max(0, Number(e.target.value || 0)))} /></label>
                <label className="field"><span className="label">عدد النساء</span><input type="number" min={0} className="input" value={women} onChange={(e) => setWomen(Math.max(0, Number(e.target.value || 0)))} /></label>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="card p-4">
              <h3 className="font-bold mb-3">٢) الضيوف والتخطيط</h3>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                <label className="field"><span className="label">عدد الرجال</span><input type="number" min={0} className="input" value={men} onChange={(e) => setMen(Math.max(0, Number(e.target.value || 0)))} /></label>
                <label className="field"><span className="label">عدد النساء</span><input type="number" min={0} className="input" value={women} onChange={(e) => setWomen(Math.max(0, Number(e.target.value || 0)))} /></label>
              </div>
              <div className="text-xs text-gray-500 mt-3">* يمكن إضافة مخطط توزيع الطاولات لاحقاً.</div>
            </div>
          )}
          {step === 3 && (
            <div className="card p-4">
              <h3 className="font-bold mb-3">٣) الإضافات</h3>
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={dhabaehActive} onChange={toggleDhabaeh} /> <span>أضف ذبايح</span></label>
              {dhabaehActive && <div className="mt-2 text-xs text-gray-500">اختيار أساسي فقط الآن — باقي الخيارات بعد الإطلاق.</div>}
              {dhabaehActive && <div className="mt-3"><small className="block mb-1 font-bold">اختيار الذبيحة</small><DynamicDhabaehMini active={true} onChange={onMiniChange} /></div>}
              <div className="text-xs text-gray-500 mt-3">* بقية الإضافات (الديكور، التصوير) ستنقل إلى إدارة منفصلة.</div>
            </div>
          )}
          {step === 4 && (
            <div className="card p-4">
              <h3 className="font-bold mb-3">٤) مراجعة وتأكيد</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="card p-3"><b>القاعة:</b> {hallName}<br /><b>التواريخ:</b> {startDate || "—"} → {endDate || startDate || "—"} ({days} يوم)<br /><b>الفترة:</b> {session}<br /><b>الأعداد:</b> رجال {men} • نساء {women}<br /><b>إضافات:</b> {addons.length ? addons.join("، ") : "لا يوجد"}</div>
                <div className="card p-3"><b>ملخص:</b><div>إيجار: {formatPrice(basePrice)} ر.س</div><div>الضيافة (تقديري): {formatPrice((men+women)*95)} ر.س</div>{dhabaehActive && dhabaehPrice>0 && <div>ذبيحة: {formatPrice(dhabaehPrice)} ر.س</div>}<div>رسوم المنصة: {formatPrice(platformFee)} ر.س</div><div>الضريبة: {formatPrice(vat)} ر.س</div><div className="font-bold mt-1">الإجمالي ≈ {formatPrice(total)} ر.س</div></div>
              </div>
              <div className="grid md:grid-cols-3 gap-3 mt-3">
                <label className="field"><span className="label">الاسم الكامل</span><input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} /></label>
                <label className="field"><span className="label">رقم الجوال</span><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
                <label className="field"><span className="label">البريد الإلكتروني (اختياري)</span><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              </div>
              <div className="text-xs text-gray-500 mt-3">بالضغط على التأكيد نضيف العناصر إلى السلة ثم تنتقل للدفع.</div>
            </div>
          )}
          <div className="flex items-center gap-2">
            {step > 1 && <button className="btn btn-ghost" onClick={backStep}>رجوع</button>}
            {step < 4 && <button className="btn btn-primary" onClick={nextStep}>التالي</button>}
            {step === 3 && <button className="btn btn-ghost" onClick={skipAddons}>تخطي</button>}
            {step === 4 && <button className="btn btn-primary" onClick={handleSubmit}>تأكيد وإلى الدفع</button>}
          </div>
        </div>
        <aside className="card p-4 h-max sticky top-24 space-y-2 text-sm">
          <h3 className="font-bold">ملخص سريع</h3>
          <div className="flex justify-between"><span>إيجار القاعة</span><b>{formatPrice(basePrice)} ر.س</b></div>
          <div className="flex justify-between"><span>الضيافة</span><b>{formatPrice(cateringEstimate)} ر.س</b></div>
          {dhabaehActive && dhabaehPrice>0 && <div className="flex justify-between"><span>ذبيحة</span><b>{formatPrice(dhabaehPrice)} ر.س</b></div>}
          <div className="flex justify-between"><span>المنصة</span><b>5%</b></div>
          <div className="flex justify-between"><span>الضريبة</span><b>15%</b></div>
          <div className="flex justify-between font-bold border-t border-dashed pt-2 mt-2"><span>الإجمالي</span><b>{formatPrice(total)} ر.س</b></div>
        </aside>
      </div>
    </>
  );
}
