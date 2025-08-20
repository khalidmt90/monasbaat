// lib/cartTypes.ts
export type CartItemBase = {
  id: string;           // unique per cart item
  type: "hall" | "service";
  title: string;
  meta?: string;        // small subtitle
  price: number;        // SAR, pre-tax
  qty: number;          // default 1
};

export type HallCartItem = CartItemBase & {
  type: "hall";
  hallId: string;
  startDate: string;
  days: number;
  session: string;
  men: number;
  women: number;
};

export type ServiceCartItem = CartItemBase & {
  type: "service";
  vendorId: string;
  packageId: string;
};

export type CartItem = HallCartItem | ServiceCartItem;

export type CartState = {
  items: CartItem[];
};
