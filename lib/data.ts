// lib/data.ts

export type City = "الرياض" | "جدة" | "مكة" | "الدمام";
export type SessionType = "صباحية" | "مسائية" | "يوم كامل";

export type Hall = {
  id: string;           // used as slug in /halls/[id]
  name: string;
  city: City;
  area: string;
  menCapacity: number;
  womenCapacity: number;
  basePrice: number;
  images: string[];
  amenities: string[];
  sessions: SessionType[];
  rating?: number;
  reviewsCount?: number;
};

export const halls: Hall[] = [
  {
    id: "yakout",
    name: "قاعة الياقوت",
    city: "الرياض",
    area: "الازدهار",
    menCapacity: 250,
    womenCapacity: 250,
    basePrice: 12000,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: ["مصلى", "مواقف", "غرفة عروس", "قسم رجال/نساء"],
    sessions: ["صباحية", "مسائية", "يوم كامل"],
    rating: 4.6,
    reviewsCount: 42,
  },
  {
    id: "fayrouz",
    name: "قاعة الفيروز",
    city: "جدة",
    area: "النعيم",
    menCapacity: 200,
    womenCapacity: 200,
    basePrice: 9500,
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: ["مصلى", "مواقف", "قاعة طعام", "قسم رجال/نساء"],
    sessions: ["مسائية", "يوم كامل"],
    rating: 4.4,
    reviewsCount: 18,
  },
  {
    id: "massa",
    name: "قاعة الماسة",
    city: "مكة",
    area: "الشرائع",
    menCapacity: 300,
    womenCapacity: 300,
    basePrice: 14000,
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: ["مصلى", "مواقف", "غرفة عروس", "قسم رجال/نساء"],
    sessions: ["صباحية", "مسائية"],
    rating: 4.7,
    reviewsCount: 27,
  },
];

// (Optional) for future services pages
export const vendors = [
  { id: "shots", name: "استوديو لقطات", kind: "photography", city: "الرياض" },
  { id: "noor", name: "عدسة نور", kind: "photography", city: "جدة" },
];
