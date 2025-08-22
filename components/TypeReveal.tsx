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
  // Detect Arabic (or other RTL Arabic script) to avoid splitting every character, which breaks letter shaping.
  const isArabic = /[\u0600-\u06FF]/.test(text);
  // For Arabic we split by words (preserving internal shaping) + spaces; otherwise characters.
  const chars = isArabic ? text.split(/(\s+)/) : Array.from(text);
  const ease: [number, number, number, number] = [0.2, 0.9, 0.2, 1];
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    return <Tag className={className}>{text}</Tag>; // no animation for reduced motion users
  }
  const initial = { opacity: 0, y: variant === "lift" ? 14 : 0, filter: "blur(4px)" };
  if (isArabic) {
    // Animate words sequentially (shorter delay step for readability)
    const wordDelay = speed * 3; // slower ramp for words
    return (
      <Tag className={className} aria-label={text}>
        {chars.map((w, i) => (
          <motion.span
            key={i + w}
            className="inline-block will-change-transform"
            initial={initial}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { delay: delay + i * wordDelay, duration: 0.55, ease } }}
          >{w === " " ? "\u00A0" : w}</motion.span>
        ))}
      </Tag>
    );
  }
  return (
    <Tag className={className} aria-label={text}>
      {chars.map((c, i) => (
        <motion.span
          key={i + c}
          className="inline-block will-change-transform"
          initial={initial}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { delay: delay + i * speed, duration: 0.55, ease } }}
        >{c === " " ? "\u00A0" : c}</motion.span>
      ))}
    </Tag>
  );
}
