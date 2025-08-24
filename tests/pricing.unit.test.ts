import { test, expect } from 'vitest';
import { prisma } from '@/lib/prisma';

async function quote(body:any){
  const { POST } = await import('@/app/api/pricing/quote/route');
  const req = new Request('http://localhost/api/pricing/quote',{ method:'POST', headers: new Headers({ 'content-type':'application/json' }), body: JSON.stringify(body) });
  const res:any = await POST(req as any); return res.json();
}

// Setup minimal pricing data for tests
async function ensurePricing(){
  const animal = await prisma.animal.upsert({ where:{ code:'A1' }, update:{}, create:{ code:'A1', nameAr:'حيوان', active:true } });
  const age = await prisma.age.upsert({ where:{ id: 'AGE1' }, update:{}, create:{ id:'AGE1', animalId: animal.id, code:'C1', nameAr:'عمر', active:true } });
  const city = await prisma.city.upsert({ where:{ code:'C_CITYX' }, update:{}, create:{ code:'C_CITYX', nameAr:'مدينة', nameEn:'CityX' } });
  const existingMap = await prisma.ageWeightMapping.findFirst({ where:{ animalId: animal.id, ageId: age.id } });
  if(!existingMap){ await prisma.ageWeightMapping.create({ data:{ animalType:animal.code, animalId: animal.id, ageId: age.id, estimatedWeightKg:5, basePriceModifier:500 } as any }); }
  const existingBase = await prisma.basePriceMatrix.findFirst({ where:{ animalId: animal.id, ageId: age.id, priceMode:'per_kg' } });
  if(!existingBase){ await prisma.basePriceMatrix.create({ data:{ animalId: animal.id, ageId: age.id, priceMode:'per_kg', unitPriceMinor:1000 } as any }); }
  const existingFee = await prisma.pricingDeliveryFee.findFirst({ where:{ cityId: city.id, deliveryMethod:'home' } as any });
  if(!existingFee){ await prisma.pricingDeliveryFee.create({ data:{ cityId: city.id, deliveryMethod:'home', baseFeeMinor:0, minOrderMinor:0 } as any }); }
  const tax = await prisma.taxSetting.findFirst({ where:{ isActive:true } });
  if(!tax){ await prisma.taxSetting.create({ data:{ vatPercent:1500 } }); }
  return { animal, age, city };
}

test('base calc per_kg with mapping pct', async () => {
  const { animal, age, city } = await ensurePricing();
  const q = await quote({ lineItems:[{ kind:'dhabaeh', animalId:animal.id, ageId:age.id }], context:{ mode:'standalone', cityId:city.id, deliveryMethod:'home' } });
  // Base: 1000 * 5kg = 5000 then +5% mapping => 5250
  expect(q.items[0].breakdown.base).toBe(5250);
  expect(q.derived[0].estimatedWeightKg).toBe(5);
});
