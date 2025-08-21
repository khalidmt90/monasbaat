// components/home/Metrics.tsx
"use client";
import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

function Counter({ to }: { to: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const controls = animate(0, to, {
      duration: 1.2,
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [to]);
  return <span>{val.toLocaleString("ar-SA")}</span>;
}

export default function Metrics() {
  const items = [
    { label: "قاعات متاحة", value: 320 },
    { label: "مزودو خدمات", value: 140 },
    { label: "حجوزات ناجحة", value: 5200 },
    { label: "متوسط تقييم", value: 4.7 },
  ];

  return (
    <section className="section section-muted">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card p-5 text-center"
            >
              <div className="text-3xl font-extrabold text-ink">
                <Counter to={it.value} />
                {it.label.includes("تقييم") ? "★" : "+"}
              </div>
              <div className="text-gray-600 mt-1">{it.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
