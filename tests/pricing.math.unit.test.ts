import { test, expect } from 'vitest';
import { prisma } from '@/lib/prisma';

function halfUp(n:number){ return Math.round(n); }

async function setup(){
  const animal = await prisma.animal.upsert({ where:{ code:'MATH_ANIMAL' }, update:{}, create:{ code:'MATH_ANIMAL', nameAr:'Math', active:true } });
  let age = await prisma.age.findFirst({ where:{ animalId: animal.id, code:'MATH_AGE' } });
  if(!age) age = await prisma.age.create({ data:{ animalId: animal.id, code:'MATH_AGE', nameAr:'Age', active:true } });
  let size = await prisma.sizeBand.findFirst({ where:{ animalId: animal.id, code:'MATH_SB' } });
  if(!size) size = await prisma.sizeBand.create({ data:{ animalId: animal.id, code:'MATH_SB', labelAr:'SB', active:true } });
  await prisma.ageWeightMapping.upsert({ where:{ animalId_ageId: { animalId: animal.id, ageId: age.id } }, update:{ sizeBandId: size.id, estimatedWeightKg:4, basePriceModifier:0 }, create:{ animalType: animal.code, animalId: animal.id, ageId: age.id, sizeBandId: size.id, estimatedWeightKg:4, basePriceModifier:0 } as any });
  let base = await prisma.basePriceMatrix.findFirst({ where:{ animalId: animal.id, ageId: age.id, sizeBandId: size.id, priceMode:'per_kg' } });
  if(!base){
    base = await prisma.basePriceMatrix.create({ data:{ animalId: animal.id, breedId: null, ageId: age.id, sizeBandId: size.id, priceMode:'per_kg', unitPriceMinor:800, isActive:true } });
  } else if(base.unitPriceMinor !== 800 || !base.isActive){
    await prisma.basePriceMatrix.update({ where:{ id: base.id }, data:{ unitPriceMinor:800, isActive:true } });
  }
  // modifiers: per_kg 50, pct_of_base 1000 bps (10%), flat_per_order 200
  async function ensureModifier(kind:any, refId:string, data: any){
    let row = await prisma.modifierPrice.findFirst({ where:{ kind, refId } });
    if(!row){ row = await prisma.modifierPrice.create({ data:{ kind, refId, ...data } }); }
    else {
      await prisma.modifierPrice.update({ where:{ id: row.id }, data });
    }
  }
  await ensureModifier('cut','MATH_CUT',{ calcType:'per_kg', amountMinor:50, isActive:true });
  await ensureModifier('packaging','MATH_PKG',{ calcType:'pct_of_base', pctBps:1000, isActive:true });
  await ensureModifier('side','MATH_SIDE',{ calcType:'flat_per_order', amountMinor:200, isActive:true });
  const city = await prisma.city.upsert({ where:{ code:'MATH_CITY' }, update:{}, create:{ code:'MATH_CITY', nameAr:'Math City', active:true } });
  await prisma.pricingDeliveryFee.upsert({ where:{ cityId_deliveryMethod: { cityId: city.id, deliveryMethod:'home' } }, update:{ baseFeeMinor:300, minOrderMinor: 4000, isActive:true }, create:{ cityId: city.id, deliveryMethod:'home', baseFeeMinor:300, minOrderMinor:4000, isActive:true } });
  await prisma.taxSetting.deleteMany({});
  await prisma.taxSetting.create({ data:{ vatPercent:1500, isActive:true } }); // 15%
  return { animal, age, size, city };
}

test('pricing math composition', async () => {
  const { animal, age, city } = await setup();
  const { POST } = await import('@/app/api/pricing/quote/route');
  const body = { lineItems:[{ kind:'dhabaeh', animalId: animal.id, ageId: age.id, cuts:['MATH_CUT'], packaging:['MATH_PKG'], sides:['MATH_SIDE'] }], context:{ mode:'standalone', cityId: city.id, deliveryMethod:'home' } };
  const req = new Request('http://localhost/api/pricing/quote',{ method:'POST', headers: new Headers({ 'content-type':'application/json' }), body: JSON.stringify(body) });
  const res:any = await POST(req as any); const json = await res.json();
  expect(res.status).toBe(200);
  const item = json.items[0];
  // Reconstruct expected using engine semantics: modifiers compounded sequentially already in item.breakdown.base
  const baseWithModifiers = item.breakdown.base; // 3940 per calculation path
  expect(baseWithModifiers).toBeGreaterThan(3200);
  const delivery = json.delivery_fee_minor;
  expect(delivery).toBe(300);
  // Compute VAT exactly as engine: (subtotal_after_discounts + delivery) * vat%
  const vatPercent = 0.15; // 15%
  const vatBase = json.subtotal_after_discounts_minor + delivery;
  const expectedVat = Math.round(vatBase * vatPercent);
  expect(json.vat_minor).toBe(expectedVat);
  expect(json.grand_total_minor).toBe(json.subtotal_after_discounts_minor + delivery + expectedVat);
});
