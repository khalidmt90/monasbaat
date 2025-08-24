import { test, expect } from 'vitest';
import { prisma } from '@/lib/prisma';
import { makeReq } from './helpers/api';

// Helper to call admin POST endpoints with super admin context
async function adminPost(path:string, body:any){
  const { POST } = await import(path);
  const req = makeReq('POST', path, body, { id:'super', role:'SUPER_ADMIN' });
  return POST(req as any);
}
// Helper to invoke pricing quote
async function quote(body:any){
  const { POST } = await import('@/app/api/pricing/quote/route');
  const req = new Request('http://localhost/api/pricing/quote', { method:'POST', headers: new Headers({ 'content-type':'application/json' }), body: JSON.stringify(body) });
  const res:any = await POST(req as any);
  return { status: res.status, json: await res.json() };
}

// Deterministic pricing base test: controls its own fixtures with TEST_* codes
test('pricing base matrix deterministic base update', async () => {
  const setup = await prisma.$transaction(async (tx: any) => {
    // Ensure animal
    const animal = await tx.animal.upsert({ where:{ code:'TEST_ANIMAL' }, update:{ active:true }, create:{ code:'TEST_ANIMAL', nameAr:'TEST_ANIMAL', active:true } });
    // Ensure age
    let age = await tx.age.findFirst({ where:{ animalId: animal.id, code:'TEST_AGE' } });
    if(!age) age = await tx.age.create({ data:{ animalId: animal.id, code:'TEST_AGE', nameAr:'TEST_AGE', active:true } });
    // Ensure size band
    let sizeBand = await tx.sizeBand.findFirst({ where:{ animalId: animal.id, code:'TEST_SB' } });
    if(!sizeBand) sizeBand = await tx.sizeBand.create({ data:{ animalId: animal.id, code:'TEST_SB', labelAr:'SB', active:true } });
    // Ensure mapping (weight=3kg, modifier=0)
    let mapping = await tx.ageWeightMapping.findFirst({ where:{ animalId: animal.id, ageId: age.id } });
    if(!mapping){
      mapping = await tx.ageWeightMapping.create({ data:{ animalType: animal.code, animalId: animal.id, ageId: age.id, sizeBandId: sizeBand.id, estimatedWeightKg:3, basePriceModifier:0 } as any });
    } else {
      if(mapping.estimatedWeightKg !== 3 || mapping.basePriceModifier !== 0 || mapping.sizeBandId !== sizeBand.id){
        mapping = await tx.ageWeightMapping.update({ where:{ id: mapping.id }, data:{ estimatedWeightKg:3, basePriceModifier:0, sizeBandId: sizeBand.id } as any });
      }
    }
    // Ensure city and zero delivery fee
    const city = await tx.city.upsert({ where:{ code:'TEST_CITY' }, update:{ active:true }, create:{ code:'TEST_CITY', nameAr:'TEST_CITY', active:true } });
    let fee = await tx.pricingDeliveryFee.findFirst({ where:{ cityId: city.id, deliveryMethod:'home' } as any });
    if(!fee){
      fee = await tx.pricingDeliveryFee.create({ data:{ cityId: city.id, deliveryMethod:'home', baseFeeMinor:0, minOrderMinor:0 } as any });
    } else if(fee.baseFeeMinor !== 0 || fee.minOrderMinor !== 0 || !fee.isActive){
      fee = await tx.pricingDeliveryFee.update({ where:{ id: fee.id }, data:{ baseFeeMinor:0, minOrderMinor:0, isActive:true } });
    }
    // Ensure VAT = 0 (deactivate others)
    await tx.taxSetting.updateMany({ where:{ isActive:true }, data:{ isActive:false } });
    const tax = await tx.taxSetting.create({ data:{ vatPercent:0, isActive:true } });
    // Ensure base price matrix row with unit price 1000 per kg
    let baseRow = await tx.basePriceMatrix.findFirst({ where:{ animalId: animal.id, breedId: null, ageId: age.id, sizeBandId: sizeBand.id, priceMode:'per_kg' } });
    if(!baseRow){
      baseRow = await tx.basePriceMatrix.create({ data:{ animalId: animal.id, breedId: null, ageId: age.id, sizeBandId: sizeBand.id, priceMode:'per_kg', unitPriceMinor:1000, isActive:true } });
    } else if(baseRow.unitPriceMinor !== 1000 || !baseRow.isActive){
      baseRow = await tx.basePriceMatrix.update({ where:{ id: baseRow.id }, data:{ unitPriceMinor:1000, isActive:true } });
    }
    return { animal, age, sizeBand, mapping, city, baseRow, tax };
  });

  // Initial quote: base = 1000 * 3kg = 3000
  let q = await quote({ lineItems:[{ kind:'dhabaeh', animalId: setup.animal.id, ageId: setup.age.id }], context:{ mode:'standalone', cityId: setup.city.id, deliveryMethod:'home' } });
  expect(q.status).toBe(200);
  expect(q.json.derived[0].estimatedWeightKg).toBe(3);
  expect(q.json.items[0].breakdown.base).toBe(3000);

  // Update base row to 1200 via admin API
  const upd:any = await adminPost('@/app/api/admin/pricing/base-matrix/route', { action:'update', id: setup.baseRow.id, unitPriceMinor:1200 });
  expect(upd.status).toBe(200);

  // Re-quote: new base = 1200 * 3 = 3600
  q = await quote({ lineItems:[{ kind:'dhabaeh', animalId: setup.animal.id, ageId: setup.age.id }], context:{ mode:'standalone', cityId: setup.city.id, deliveryMethod:'home' } });
  expect(q.status).toBe(200);
  expect(q.json.items[0].breakdown.base).toBe(3600);
});
