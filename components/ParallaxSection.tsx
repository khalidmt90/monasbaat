"use client";
import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number; // positive => slower content, negative => opposite
  className?: string;
  innerClassName?: string;
}

export function ParallaxSection({ children, speed = 0.25, className = "", innerClassName = "" }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -60, speed * 60]);
  return (
    <section ref={ref} className={className + " relative overflow-hidden"}>
      <motion.div style={{ y }} className={innerClassName + " will-change-transform"}>
        {children}
      </motion.div>
    </section>
  );
}
