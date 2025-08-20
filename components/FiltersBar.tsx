"use client";

import { useState } from "react";

export default function FiltersBar() {
  const [city, setCity] = useState("");
  const [session, setSession] = useState("");
  const [men, setMen] = useState("");
  const [women, setWomen] = useState("");

  return (
    <div className="card p-4 space-y-3">
      <h3 className="font-bold mb-2">فلترة</h3>
      <label className="field">
        <span className="label">المدينة</span>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input"
        />
      </label>

      <label className="field">
        <span className="label">الجلسة</span>
        <select value={session} onChange={(e) => setSession(e.target.value)} className="select">
          <option value="">الكل</option>
          <option value="morning">صباحية</option>
          <option value="evening">مسائية</option>
        </select>
      </label>

      <label className="field">
        <span className="label">عدد الرجال</span>
        <input
          type="number"
          value={men}
          onChange={(e) => setMen(e.target.value)}
          className="input"
        />
      </label>

      <label className="field">
        <span className="label">عدد النساء</span>
        <input
          type="number"
          value={women}
          onChange={(e) => setWomen(e.target.value)}
          className="input"
        />
      </label>

      <button className="btn btn-primary w-full">تطبيق</button>
    </div>
  );
}
