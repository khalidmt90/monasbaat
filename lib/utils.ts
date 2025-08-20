// lib/utils.ts
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(n: number) {
  return n.toLocaleString("ar-SA");
}
