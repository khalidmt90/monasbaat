"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * RouteProgress: lightweight top progress bar for App Router navigations.
 * Heuristic: when pathname changes => start fake incremental progress until component mounts for new route (this effect runs) then complete.
 */
export default function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // start on route change
    setVisible(true);
    setProgress(0);
  if (timerRef.current) window.clearInterval(timerRef.current);
  timerRef.current = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p; // cap until completion
        const inc = Math.random() * 12 + 8; // 8 - 20
        return Math.min(p + inc, 90);
      });
    }, 180);

    // complete shortly after mount (data + layout rendered)
    const completeTimeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        if (timerRef.current) window.clearInterval(timerRef.current);
      }, 300);
    }, 600); // allow a brief perceived load

    return () => {
  window.clearTimeout(completeTimeout);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="route-progress"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          aria-hidden="true"
        >
          <motion.div
            className="route-progress__bar"
            style={{ width: `${progress}%` }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ ease: [0.2, 0.9, 0.2, 1], duration: 0.4 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
