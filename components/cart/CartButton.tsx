"use client";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartButton(){
  const { count } = useCart();
  return (
    <Link href="/checkout" className="relative btn btn-ghost !p-2" aria-label="السلة">
      <i className="fa-solid fa-shopping-cart" />
      {count>0 && <span className="absolute -top-1 -left-1 bg-primary text-white text-[10px] rounded-full px-1 leading-4">{count}</span>}
    </Link>
  );
}