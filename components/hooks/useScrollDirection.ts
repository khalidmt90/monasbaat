"use client";
import { useEffect, useState } from "react";

export function useScrollDirection(threshold = 4) {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [y, setY] = useState(0);

  useEffect(() => {
    let lastY = window.scrollY;
    function onScroll() {
      const current = window.scrollY;
      const diff = Math.abs(current - lastY);
      if (diff > threshold) {
        setDirection(current > lastY ? "down" : "up");
        lastY = current;
        setY(current);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return { direction, y };
}
