// lib/halls.ts (server-only data & helpers)
export type Hall = {
  slug: string;
  name: string;
  city: string;
  area: string;
  capacityMen: number;
  capacityWomen: number;
  basePrice: number;
  images: string[];
  amenities: string[];
};

export const HALLS: Hall[] = [
  {
    slug: "al-yakout",
    name: "قاعة الياقوت",
    city: "الرياض",
    area: "الازدهار",
    capacityMen: 250,
    capacityWomen: 250,
    basePrice: 12000,
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: ["مصلى", "مواقف", "غرفة عروس", "قسم رجال/نساء"],
  },
  {
    slug: "al-fayrouz",
    name: "قاعة الفيروز",
    city: "جدة",
    area: "النعيم",
    capacityMen: 200,
    capacityWomen: 200,
    basePrice: 9500,
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: ["مصلى", "مواقف", "قاعة طعام", "قسم رجال/نساء"],
  },
  {
    slug: "al-massa",
    name: "قاعة الماسة",
    city: "مكة",
    area: "الشرائع",
    capacityMen: 300,
    capacityWomen: 300,
    basePrice: 14000,
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: ["مصلى", "مواقف", "غرفة عروس", "قسم رجال/نساء"],
  },
];

export function listHalls(): Hall[] {
  return HALLS;
}

export function getHallBySlug(slug: string): Hall | undefined {
  return HALLS.find(h => h.slug === slug);
}
