"use client";
import { ReactNode, useEffect, useRef } from "react";

interface AutoStaggerProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  from?: number; // starting translateY
  delayStep?: number; // seconds per item
}

/**
 * AutoStagger: Uses IntersectionObserver to reveal direct child elements with a stagger.
 * Avoids Framer Motion for lighter bundle where simple fades suffice.
 */
export function AutoStagger({
  children,
  className,
  threshold = 0.22,
  rootMargin = "0px 0px -10% 0px",
  from = 18,
  delayStep = 0.06,
}: AutoStaggerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = Array.from(el.children) as HTMLElement[];
    if (reduce) {
      // show immediately
      items.forEach(c => { c.style.opacity = "1"; c.style.transform = "none"; c.style.filter = "none"; });
      return;
    }
    items.forEach((c, i) => {
      c.style.opacity = "0";
      c.style.transform = `translateY(${from}px)`;
      c.style.transition = `opacity .7s var(--easing-standard) ${i * delayStep}s, transform .7s var(--easing-standard) ${i * delayStep}s, filter .9s var(--easing-standard) ${i * delayStep}s`;
      c.style.filter = "blur(8px)";
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((c) => {
              c.style.opacity = "1";
              c.style.transform = "translateY(0)";
              c.style.filter = "blur(0px)";
            });
            io.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, from, delayStep]);
  return (
    <div ref={ref} className={className} data-auto-stagger>
      {children}
    </div>
  );
}
