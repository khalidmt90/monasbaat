// lib/services.ts
export type ServiceCategory = "decor" | "photography" | "catering" | "coffee";

export type ServiceVendor = {
  id: string;
  name: string;
  city: string;
  category: ServiceCategory;
  image?: string;
  packages: {
    id: string;
    title: string;
    desc?: string;
    priceFrom: number; // SAR
  }[];
};

export const serviceVendors: ServiceVendor[] = [
  {
    id: "decor-gold-co",
    name: "دهب ديزاين",
    city: "الرياض",
    category: "decor",
    image: "https://images.unsplash.com/photo-1523359346063-d879354c0ea5?q=80&w=1600&auto=format&fit=crop",
    packages: [
      { id: "decor-basic", title: "باقة أساسية", priceFrom: 2000 },
      { id: "decor-gold", title: "باقة ذهبية", priceFrom: 4500 },
    ],
  },
  {
    id: "photo-shots",
    name: "استوديو لقطات",
    city: "الرياض",
    category: "photography",
    image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
    packages: [
      { id: "photo-men", title: "تصوير رجال — فوتو", priceFrom: 1500 },
      { id: "photo-women", title: "تصوير نساء — فوتو", priceFrom: 1800 },
      { id: "video", title: "فيديو + مونتاج", priceFrom: 2500 },
    ],
  },
  {
    id: "coffee-team",
    name: "قهوتنا",
    city: "جدة",
    category: "coffee",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=1600&auto=format&fit=crop",
    packages: [
      { id: "coffee-4h", title: "طاقم قهوة 4 ساعات", priceFrom: 1200 },
      { id: "coffee-8h", title: "طاقم قهوة 8 ساعات", priceFrom: 2000 },
    ],
  },
];
