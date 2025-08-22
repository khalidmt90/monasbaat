"use client";
import { useEffect } from "react";

/** Prefetch dynamically loaded UI modules when the browser is idle */
export default function IdlePrefetch() {
  useEffect(() => {
    const ric: any = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 180));
    const cancel: any = (window as any).cancelIdleCallback || clearTimeout;
    const id = ric(async () => {
      // Fire and forget dynamic imports (code already split elsewhere)
      import("@/components/TypeReveal");
      import("@/components/home/ParallaxCards");
      import("@/components/home/VendorMarquee");
    });
    return () => cancel(id);
  }, []);
  return null;
}
