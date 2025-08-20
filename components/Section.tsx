"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";

export default function Section({
  children,
  muted = false,
  className = "",
}: { children: ReactNode; muted?: boolean; className?: string }) {
  return (
    <section className={`section ${muted ? "section-muted" : ""} ${className}`}>
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
