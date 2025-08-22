// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import * as React from "react";
import { CartProvider } from "@/components/CartProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
