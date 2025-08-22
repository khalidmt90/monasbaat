"use client";
import { motion, useReducedMotion } from "framer-motion";

interface TypeRevealProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  className?: string;
  speed?: number; // seconds per character
  variant?: "typing" | "fade" | "lift";
}

export default function TypeReveal({
  text,
  as = "h1",
  delay = 0,
  className = "",
  speed = 0.035,
  variant = "lift",
}: TypeRevealProps) {
  const Tag = as as any;
  const chars = Array.from(text);
  const ease: [number, number, number, number] = [0.2, 0.9, 0.2, 1];
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    return <Tag className={className}>{text}</Tag>; // no animation for reduced motion users
  }
  const initial = { opacity: 0, y: variant === "lift" ? 14 : 0, filter: "blur(4px)" };
  return <Tag className={className} aria-label={text}>{chars.map((c, i) => (
    <motion.span
      key={i + c}
      className="inline-block will-change-transform"
      initial={initial}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { delay: delay + i * speed, duration: 0.55, ease } }}
    >{c === " " ? "\u00A0" : c}</motion.span>
  ))}</Tag>;
}
