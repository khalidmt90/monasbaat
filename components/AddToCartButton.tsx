"use client";

import { useId } from "react";
import { useCart } from "./CartProvider";
import type { ServiceCartItem } from "@/lib/cartTypes";

export default function AddToCartButton({
  vendorId,
  packageId,
  title,
  meta,
  price,
}: {
  vendorId: string;
  packageId: string;
  title: string;
  meta?: string;
  price: number;
}) {
  const { addItem } = useCart();
  const gen = useId();
  function add() {
    const item: ServiceCartItem = {
      id: `svc-${packageId}-${gen}`,
      type: "service",
      vendorId,
      packageId,
      title,
      meta,
      price,
      qty: 1,
    };
    addItem(item);
  }
  return (
    <button className="btn btn-primary" onClick={add}>
      <i className="fa-solid fa-cart-plus ms-1" /> أضف للسلة
    </button>
  );
}
