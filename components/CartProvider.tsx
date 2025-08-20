"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, CartState } from "@/lib/cartTypes";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: number;
  count: number;
};
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [] });

  // load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem("monasbaat_cart");
      if (raw) setState(JSON.parse(raw));
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem("monasbaat_cart", JSON.stringify(state));
    } catch {}
  }, [state]);

  function addItem(item: CartItem) {
    setState((s) => ({
      items: [...s.items, item],
    }));
  }

  function removeItem(id: string) {
    setState((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  }

  function clear() {
    setState({ items: [] });
  }

  const total = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * (i.qty || 1), 0),
    [state.items]
  );
  const count = state.items.length;

  const value = { items: state.items, addItem, removeItem, clear, total, count };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
