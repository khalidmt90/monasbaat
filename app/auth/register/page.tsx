// app/auth/register/page.tsx
"use client";
import { useState } from "react";
import { useAuth, Role } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { registerStart, verifyOtp } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [sent, setSent] = useState(false);
  const [mock, setMock] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();

  async function send() {
    const res = await registerStart({ name: name.trim(), phone: phone.trim(), role });
    if (res.otpSent) {
      setSent(true);
      setMock(res.mockCode);
    }
  }
  async function confirm() {
    const ok = await verifyOtp(phone.trim(), code.trim());
    if (ok) {
      if (role === "vendor") router.replace("/vendor/dashboard");
      else router.replace("/account");
    } else {
      alert("رمز غير صحيح");
    }
  }

  return (
    <section className="section">
      <div className="container max-w-md">
        <div className="card p-5">
          <h1 className="text-2xl font-bold mb-2">إنشاء حساب</h1>
          {!sent ? (
            <>
              <label className="field"><span className="label">الاسم</span><input className="input" value={name} onChange={(e)=>setName(e.target.value)} /></label>
              <label className="field"><span className="label">الجوال</span><input className="input" value={phone} onChange={(e)=>setPhone(e.target.value)} /></label>
              <label className="field">
                <span className="label">نوع الحساب</span>
                <select className="select" value={role} onChange={(e)=>setRole(e.target.value as Role)}>
                  <option value="user">عميل</option>
                  <option value="vendor">مزود خدمة/قاعة</option>
                </select>
              </label>
              <button className="btn btn-primary mt-3" onClick={send}>إرسال رمز</button>
            </>
          ) : (
            <>
              <div className="text-sm text-gray-600 mb-2">* للنسخة التجريبية: الرمز هو <b>{mock}</b></div>
              <label className="field"><span className="label">الرمز</span><input className="input" value={code} onChange={(e)=>setCode(e.target.value)} /></label>
              <button className="btn btn-primary mt-3" onClick={confirm}>تأكيد</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
