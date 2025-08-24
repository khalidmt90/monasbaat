"use client";
import { ReactNode } from "react";
import { ParallaxBanner } from "@/components/Animated"; // you already have this
import Link from "next/link";

export default function HeroBanner({
  title,
  subtitle,
  ctas = [],
  image,
  height = "min-h-[60vh]",
  center = true,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  ctas?: { href: string; label: string; icon?: string; variant?: "gold" | "ghost" }[];
  image: string;
  height?: string;
  center?: boolean;
}) {
  return (
    <div className="container pt-6">
      <ParallaxBanner image={image} height={height}>
        <div className={`flex ${center ? "items-center justify-center" : "items-end"} h-full text-center`}>
          <div className="max-w-2xl px-6 pb-10">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-md">{title}</h1>
            {subtitle ? <p className="mt-4 text-white/95 text-lg md:text-xl max-w-prose">{subtitle}</p> : null}
            {ctas.length > 0 && (
              <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                {ctas.map((c, i) => (
                  <Link
                    key={i}
                    href={c.href}
                    className={c.variant === "ghost" ? "btn btn-ghost" : "btn btn-primary cta-pulse"}
                  >
                    {c.icon ? <i className={`fa-solid ${c.icon} ms-1`} /> : null}
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </ParallaxBanner>
    </div>
  );
}
