// lib/types.ts
export type City = "الرياض" | "جدة" | "مكة" | "الدمام";
export type SessionType = "صباحية" | "مسائية" | "يوم كامل";

export type Review = {
  author: string;
  rating: number; // 1..5
  comment?: string;
  date: string; // ISO
};

export type ServiceKind = "catering" | "decor" | "photography" | "coffee";

export type Vendor = {
  id: string;
  name: string;
  kind: ServiceKind | "hall";
  city: City;
  images: string[];
  rating?: number;
  reviewsCount?: number;
};

export type Hall = Vendor & {
  kind: "hall";
  area: string;
  menCapacity: number;
  womenCapacity: number;
  basePrice: number;
  amenities: string[];
  sessions: SessionType[];
};

export type ServicePackage = {
  id: string;
  vendorId: string;
  title: string;
  priceFrom: number;
  perGuest?: boolean;
  description?: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
