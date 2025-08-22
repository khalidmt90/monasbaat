"use client";
import { useEffect, useState } from "react";

function getInitial(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => getInitial());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark"); else root.classList.remove("dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      type="button"
      aria-label={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
      className="btn btn-ghost !px-3 !py-2 text-lg"
      onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <i className="fa-solid fa-sun" /> : <i className="fa-solid fa-moon" />}
    </button>
  );
}
