"use client";
import { useState, useEffect } from "react";

export default function LangSwitch(){
  const [lang,setLang]=useState<string>(()=> typeof window!=="undefined" ? (localStorage.getItem("lang")||"ar") : "ar");
  useEffect(()=>{ try{ localStorage.setItem("lang",lang);}catch{} },[lang]);
  function toggle(){ setLang(l=> l==="ar"?"en":"ar"); }
  return (
    <button onClick={toggle} className="btn btn-ghost text-xs" aria-label="تبديل اللغة">
      {lang==="ar"?"EN":"عربي"}
    </button>
  );
}