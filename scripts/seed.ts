import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// settings-commit-anchor: includes GlobalConfig & feature flags seed data

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL!;
  const password = process.env.SEED_ADMIN_PASSWORD!;
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: hash, role: "ADMIN", name: "Super Admin" },
  });

  // === Catalog seed (idempotent) ===
  const p = prisma;
  const lamb = await p.animal.upsert({ where:{ code:"lamb" }, update:{ nameAr:"خروف" }, create:{ code:"lamb", nameAr:"خروف", nameEn:"Lamb" }});
  const young = await p.age.upsert({ where:{ id: lamb.id+"-young" }, update:{}, create:{ id: lamb.id+"-young", animalId:lamb.id, code:"young", nameAr:"صغير", nameEn:"Young" }});
  const adult = await p.age.upsert({ where:{ id: lamb.id+"-adult" }, update:{}, create:{ id: lamb.id+"-adult", animalId:lamb.id, code:"adult", nameAr:"بالغ", nameEn:"Adult" }});
  const bandM = await p.sizeBand.upsert({ where:{ id:lamb.id+"-med" }, update:{}, create:{ id:lamb.id+"-med", animalId:lamb.id, code:"M", labelAr:"متوسط", labelEn:"Medium", minWeight:1500, maxWeight:1900 }});
  // AgeWeightMapping has @@unique([animalType, ageId]) so use those fields in upsert via unique composite not exposed -> fallback check
  const existingYoung = await p.ageWeightMapping.findFirst({ where:{ animalType:"lamb", ageId:young.id }});
  if(!existingYoung){ await p.ageWeightMapping.create({ data:{ animalType:"lamb", ageId:young.id, sizeBandId:bandM.id, estimatedWeightKg:18, basePriceModifier:0 }}); }
  const existingAdult = await p.ageWeightMapping.findFirst({ where:{ animalType:"lamb", ageId:adult.id }});
  if(!existingAdult){ await p.ageWeightMapping.create({ data:{ animalType:"lamb", ageId:adult.id, sizeBandId:bandM.id, estimatedWeightKg:24, basePriceModifier:300 }}); }
  await p.basePrice.upsert({ where:{ id:lamb.id+"-base" }, update:{}, create:{ id:lamb.id+"-base", animalId:lamb.id, priceBase: 900 }});
  await p.cutPreset.upsert({ where:{ code:"std" }, update:{}, create:{ code:"std", nameAr:"تقطيع عادي", priceModifier:0 }});
  await p.packagingOption.upsert({ where:{ code:"bag" }, update:{}, create:{ code:"bag", nameAr:"أكياس", priceModifier:50 }});
  await p.cookingOption.upsert({ where:{ code:"none" }, update:{}, create:{ code:"none", nameAr:"بدون طبخ", priceModifier:0 }});
  await p.sideOption.upsert({ where:{ code:"rice" }, update:{}, create:{ code:"rice", nameAr:"رز", priceModifier:120 }});
  await p.deliveryFee.upsert({ where:{ id:"home-fee" }, update:{}, create:{ id:"home-fee", target:"HOME", fee:80 }});
  await p.globalConfig.upsert({ where:{ key:"vat_percent" }, update:{ value:{ percent:15 }}, create:{ key:"vat_percent", value:{ percent:15 }} });
  // Bank transfer settings (placeholder values)
  await p.globalConfig.upsert({ where:{ key:'bank.transfer.settings' }, update:{ value:{ beneficiary:'Company Name', iban:'SA00 0000 0000 0000 0000 0000', bankName:'Sample Bank', instructions:{ ar:'حول المبلغ إلى الحساب أعلاه واذكر رقم الطلب', en:'Transfer the amount to the account above and include the order reference' }, deadlineHours:24 } }, create:{ key:'bank.transfer.settings', value:{ beneficiary:'Company Name', iban:'SA00 0000 0000 0000 0000 0000', bankName:'Sample Bank', instructions:{ ar:'حول المبلغ إلى الحساب أعلاه واذكر رقم الطلب', en:'Transfer the amount to the account above and include the order reference' }, deadlineHours:24 } }});
  // Initialize counters if absent
  const counters = ['order_ref','invoice_no'];
  for(const key of counters){
    await p.counter.upsert({ where:{ key }, update:{}, create:{ key, value:0 } });
  }

  // Cities (serviceable)
  const cityList = [
    { code:'riyadh', nameAr:'الرياض', nameEn:'Riyadh' },
    { code:'jeddah', nameAr:'جدة', nameEn:'Jeddah' },
    { code:'makkah', nameAr:'مكة', nameEn:'Makkah' },
    { code:'dammam', nameAr:'الدمام', nameEn:'Dammam' },
  ];
  for(const c of cityList){
  await p.city.upsert({ where:{ code:c.code }, update:{ nameAr:c.nameAr, nameEn:c.nameEn }, create:{ code:c.code, nameAr:c.nameAr, nameEn:c.nameEn }});
  }

  // Homepage content blocks (idempotent)
  await p.globalConfig.upsert({ where:{ key:'home.hero' }, update:{}, create:{ key:'home.hero', value: {
    halls: { headline:{ ar:'احجز قاعة زواجك/مناسبتك بسهولة، بمواصفات تناسب ذوقك', en:'Book your wedding/event hall easily with the features you prefer' }, cta:{ ar:'استعرض القاعات', en:'Browse Halls' }, image:'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop' },
    dhabaeh: { headline:{ ar:'اطلب ذبايح للبيت أو توصّل للمناسبة مباشرة', en:'Order dhabaeh for home or direct hall delivery' }, cta:{ ar:'اطلب ذبايح', en:'Order Dhabaeh' }, image:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop' }
  }}});

  await p.globalConfig.upsert({ where:{ key:'home.how' }, update:{}, create:{ key:'home.how', value:{
    halls:{ steps:[
      { text:{ ar:'اختر القاعة والتاريخ', en:'Choose hall & date' }, icon:'calendar' },
      { text:{ ar:'أضف خدماتك', en:'Add services' }, icon:'plus' },
      { text:{ ar:'ادفع وأكّد الحجز', en:'Pay & confirm' }, icon:'check' },
    ]},
    dhabaeh:{ steps:[
      { text:{ ar:'اختر النوع والعمر', en:'Select type & age' }, icon:'paw' },
      { text:{ ar:'اختر المعالجات', en:'Choose processing options' }, icon:'sliders' },
      { text:{ ar:'حدد التوصيل', en:'Set delivery' }, icon:'truck' },
    ]}
  }}});

  await p.globalConfig.upsert({ where:{ key:'home.trust' }, update:{}, create:{ key:'home.trust', value:{
    signals:[
      { title:{ ar:'منصة سعودية', en:'Saudi Platform' }, desc:{ ar:'تشغيل محلي وفريق دعم قريب منك', en:'Local operations & nearby support' }, icon:'flag' },
      { title:{ ar:'مدفوعات آمنة', en:'Secure Payments' }, desc:{ ar:'بوابات دفع موثوقة تشمل الفواتير الضريبية', en:'Trusted gateways with VAT invoices' }, icon:'shield' },
      { title:{ ar:'دعم سريع', en:'Fast Support' }, desc:{ ar:'مساعدة عبر القنوات المتاحة', en:'Help through available channels' }, icon:'headset' },
    ]
  }}});

  await p.globalConfig.upsert({ where:{ key:'home.cities' }, update:{}, create:{ key:'home.cities', value:{ tagline:{ ar:'مدن الخدمة الحالية', en:'Current Service Cities' } }}});

  console.log("Seeded admin:", email);
}

main().finally(() => prisma.$disconnect());
