// lib/data.ts

export type SessionType = "صباحية" | "مسائية" | "يوم كامل";

export type Hall = {
  id: string;                 // slug/id in URLs
  name: string;
  city: string;
  area: string;
  menCapacity: number;
  womenCapacity: number;
  basePrice: number;
  sessions: SessionType[];
  images: string[];
  amenities?: string[];
  rating?: number;
  reviewsCount?: number;
  // optional map coordinates
  lat?: number;
  lng?: number;
};

export const cities = ["الرياض", "جدة", "مكة", "الدمام"] as const;

export const halls: Hall[] = [
  {
    id: "al-yakout",
    name: "قاعة الياقوت",
    city: "الرياض",
    area: "الازدهار",
    menCapacity: 300,
    womenCapacity: 300,
    basePrice: 12000,
    sessions: ["صباحية", "مسائية", "يوم كامل"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: ["قاعة رجال", "قاعة نساء", "قاعة صلاة", "جناح العروس", "مواقف", "خدمة ضيافة"],
    rating: 4.6,
    reviewsCount: 42,
    lat: 24.774265,
    lng: 46.738586, // ✅ fixed key (was "Ing")
  },
  {
    id: "al-fayrouz",
    name: "قاعة الفيروز",
    city: "جدة",
    area: "الشاطئ",
    menCapacity: 250,
    womenCapacity: 250,
    basePrice: 9500,
    sessions: ["مسائية", "يوم كامل"],
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: ["قاعة رجال", "قاعة نساء", "مسرح", "إضاءة", "مواقف"],
    rating: 4.4,
    reviewsCount: 31,
    lat: 21.543333,
    lng: 39.172779,
  },
  {
    id: "al-massa",
    name: "قاعة الماسة",
    city: "مكة",
    area: "العزيزية",
    menCapacity: 350,
    womenCapacity: 350,
    basePrice: 14000,
    sessions: ["صباحية", "مسائية"],
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: ["قاعة رجال", "قاعة نساء", "قاعة صلاة", "نظام صوت", "مواقف"],
    rating: 4.7,
    reviewsCount: 55,
    lat: 21.389082,
    lng: 39.85791,
  },
];

// helper
export function getHallById(id: string): Hall | undefined {
  return halls.find((h) => h.id === id);
}
