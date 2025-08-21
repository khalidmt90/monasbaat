// app/auth/login/page.tsx
"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { loginStart, verifyOtp } = useAuth();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [mock, setMock] = useState("");
  const router = useRouter();

  async function sendCode() {
    const res = await loginStart(phone.trim());
    if (res.otpSent) {
      setSent(true);
      setMock(res.mockCode);
    }
  }
  async function confirm() {
    const ok = await verifyOtp(phone.trim(), code.trim());
    if (ok) router.replace("/account");
    else alert("رمز غير صحيح");
  }

  return (
    <section className="section">
      <div className="container max-w-md">
        <div className="card p-5">
          <h1 className="text-2xl font-bold mb-2">تسجيل الدخول</h1>
          {!sent ? (
            <>
              <label className="field">
                <span className="label">رقم الجوال</span>
                <input className="input" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="05xxxxxxxx" />
              </label>
              <button className="btn btn-primary mt-3" onClick={sendCode}>إرسال رمز</button>
            </>
          ) : (
            <>
              <div className="text-sm text-gray-600 mb-2">* للنسخة التجريبية: الرمز هو <b>{mock}</b></div>
              <label className="field">
                <span className="label">الرمز</span>
                <input className="input" value={code} onChange={(e)=>setCode(e.target.value)} placeholder="123456" />
              </label>
              <button className="btn btn-primary mt-3" onClick={confirm}>تأكيد</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
