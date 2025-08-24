import { test, expect } from 'vitest';
import { prisma } from '@/lib/prisma';

async function setup(){
  const animal = await prisma.animal.upsert({ where:{ code:'STD_ANIMAL' }, update:{ active:true }, create:{ code:'STD_ANIMAL', nameAr:'Std', active:true } });
  let age = await prisma.age.findFirst({ where:{ animalId: animal.id, code:'STD_AGE' } });
  if(!age) age = await prisma.age.create({ data:{ animalId: animal.id, code:'STD_AGE', nameAr:'Age', active:true } });
  let size = await prisma.sizeBand.findFirst({ where:{ animalId: animal.id, code:'STD_SB' } });
  if(!size) size = await prisma.sizeBand.create({ data:{ animalId: animal.id, code:'STD_SB', labelAr:'SB', active:true } });
  await prisma.ageWeightMapping.upsert({ where:{ animalId_ageId: { animalId: animal.id, ageId: age.id } }, update:{ sizeBandId: size.id, estimatedWeightKg:6, basePriceModifier:0 }, create:{ animalType: animal.code, animalId: animal.id, ageId: age.id, sizeBandId: size.id, estimatedWeightKg:6, basePriceModifier:0 } as any });
  let base = await prisma.basePriceMatrix.findFirst({ where:{ animalId: animal.id, ageId: age.id, sizeBandId: size.id, priceMode:'per_kg' } });
  if(!base){
    base = await prisma.basePriceMatrix.create({ data:{ animalId: animal.id, breedId:null, ageId: age.id, sizeBandId: size.id, priceMode:'per_kg', unitPriceMinor:900, isActive:true } });
  } else if(base.unitPriceMinor !== 900 || !base.isActive){
    await prisma.basePriceMatrix.update({ where:{ id: base.id }, data:{ unitPriceMinor:900, isActive:true } });
  }
  const city = await prisma.city.upsert({ where:{ code:'STD_CITY' }, update:{}, create:{ code:'STD_CITY', nameAr:'StdCity', active:true } });
  await prisma.pricingDeliveryFee.upsert({ where:{ cityId_deliveryMethod: { cityId: city.id, deliveryMethod:'home' } }, update:{ baseFeeMinor:0, minOrderMinor:0, isActive:true }, create:{ cityId: city.id, deliveryMethod:'home', baseFeeMinor:0, minOrderMinor:0, isActive:true } });
  await prisma.taxSetting.updateMany({ where:{ isActive:true }, data:{ isActive:false } });
  await prisma.taxSetting.create({ data:{ vatPercent:0, isActive:true } });
  return { animal, age, size, city };
}

test('standalone dhabaeh quote populates derived size & weight and base price', async () => {
  const { animal, age, city, size } = await setup();
  const { POST } = await import('@/app/api/pricing/quote/route');
  const body = { lineItems:[{ kind:'dhabaeh', animalId: animal.id, ageId: age.id }], context:{ mode:'standalone', cityId: city.id, deliveryMethod:'home' } };
  const req = new Request('http://localhost/api/pricing/quote',{ method:'POST', headers: new Headers({ 'content-type':'application/json' }), body: JSON.stringify(body) });
  const res:any = await POST(req as any); const json = await res.json();
  expect(res.status).toBe(200);
  const d = json.derived[0];
  expect(d.estimatedWeightKg).toBe(6);
  expect(d.sizeBandId).toBe(size.id);
  expect(json.items[0].breakdown.base).toBe(900*6);
});
