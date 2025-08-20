"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function FadeIn({ children, delay = 0, y = 16 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export function HoverLift({ children }: { children: ReactNode }) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
      {children}
    </motion.div>
  );
}

export function Stagger({ children, delay = 0.1 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function Item({ children, y = 12 }: { children: ReactNode; y?: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxBanner({
  image,
  height = "min-h-[60vh]",
  children,
}: {
  image: string;
  height?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div ref={ref} className={`relative ${height} overflow-hidden rounded-2xl`}>
      <motion.div
        style={{ y, backgroundImage: `url(${image})` }}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}
