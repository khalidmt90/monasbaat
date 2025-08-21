// lib/services.ts

export type ServiceKind = "catering" | "decor" | "photography" | "coffee";

export type ServiceItem = {
  id: string;
  kind: ServiceKind;
  title: string;     // e.g., "كاترينغ — باقة ذهبية"
  vendor: string;    // provider name
  city: string;      // used to filter by hall city
  priceFrom: number; // SAR (per person or package)
};

export const services: ServiceItem[] = [
  // Riyadh examples
  { id: "cat-gold", kind: "catering",     title: "كاترينغ — باقة ذهبية",    vendor: "ضيافتنا", city: "الرياض", priceFrom: 95 },
  { id: "dec-basic", kind: "decor",       title: "ديكور — باقة أساسية",     vendor: "زهورنا",  city: "الرياض", priceFrom: 3500 },
  { id: "ph-men",    kind: "photography", title: "تصوير — رجال",             vendor: "عدسة X",  city: "الرياض", priceFrom: 2200 },
  { id: "ph-women",  kind: "photography", title: "تصوير — نساء",             vendor: "عدسة Y",  city: "الرياض", priceFrom: 2400 },
  { id: "coffee-4h", kind: "coffee",      title: "قهوة وشاي — طاقم 4 ساعات", vendor: "قهوتنا", city: "الرياض", priceFrom: 1200 },

  // Jeddah examples
  { id: "cat-silver-jed", kind: "catering",     title: "كاترينغ — باقة فضية", vendor: "مذاق جدة", city: "جدة", priceFrom: 80 },
  { id: "dec-prem-jed",   kind: "decor",        title: "ديكور — باقة مميزة",  vendor: "ورد جدة", city: "جدة", priceFrom: 4800 },

  // Makkah examples
  { id: "ph-bundle-mak",  kind: "photography",  title: "تصوير — فوتو + فيديو", vendor: "عدسة مكة", city: "مكة", priceFrom: 3800 },
  { id: "coffee-elite-mak", kind: "coffee",     title: "قهوة — نخبة",          vendor: "بن مكة",   city: "مكة", priceFrom: 1500 },
];
