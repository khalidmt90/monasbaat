import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  as?: "a" | "button" | "link";
  href?: string;
  variant?: "primary" | "gold" | "ghost";
  className?: string;
  children: React.ReactNode;
};

export default function Button({ as="button", href, variant="primary", className, children }: Props) {
  const base = "btn";
  const variants = {
    primary: "btn-primary",
    gold: "btn-gold",
    ghost: "btn-ghost",
  } as const;

  const cls = cn(base, variants[variant], className);

  if (as === "link" && href) return <Link href={href} className={cls}>{children}</Link>;
  if (as === "a" && href) return <a href={href} className={cls}>{children}</a>;
  return <button className={cls}>{children}</button>;
}
