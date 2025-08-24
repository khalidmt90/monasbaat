import { test, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/prisma';

async function setup(){
  const animal = await prisma.animal.upsert({ where:{ code:'PMOD' }, update:{}, create:{ code:'PMOD', nameAr:'حيوان', active:true } });
  const age = await prisma.age.upsert({ where:{ id:'PMOD_AGE' }, update:{}, create:{ id:'PMOD_AGE', animalId: animal.id, code:'PMA', nameAr:'عمر', active:true } });
  const city = await prisma.city.upsert({ where:{ code:'PMOD_CITY' }, update:{}, create:{ code:'PMOD_CITY', nameAr:'مدينة', nameEn:'PM City' } });
  await prisma.ageWeightMapping.create({ data:{ animalType: animal.code, animalId: animal.id, ageId: age.id, estimatedWeightKg:10, basePriceModifier:0 } as any }).catch(()=>{});
  await prisma.basePriceMatrix.create({ data:{ animalId: animal.id, ageId: age.id, priceMode:'per_kg', unitPriceMinor:200 } as any }).catch(()=>{});
  await prisma.pricingDeliveryFee.create({ data:{ cityId: city.id, deliveryMethod:'home', baseFeeMinor:0, minOrderMinor:0 } as any }).catch(()=>{});
  const makeMod = (kind:'cut'|'packaging'|'cooking'|'side', refId:string, calcType:any, amountMinor?:number, pctBps?:number)=> prisma.modifierPrice.create({ data:{ kind, refId, calcType, amountMinor, pctBps } as any });
  await makeMod('cut','CUT1','per_kg',50); // 50 * 10 = 500
  await makeMod('packaging','PK1','per_unit',300); // 300
  await makeMod('cooking','CK1','flat_per_order',200); // 200
  await makeMod('side','SD1','pct_of_base', null as any, 1000); // 10% of base (base initial 200*10=2000)
  return { animal, age, city };
}

async function quote(body:any){ const { POST } = await import('@/app/api/pricing/quote/route'); const req = new Request('http://localhost/api/pricing/quote',{ method:'POST', headers: new Headers({ 'content-type':'application/json' }), body: JSON.stringify(body) }); const res:any = await POST(req as any); return res.json(); }

test('modifier calc types aggregate correctly', async () => {
  const { animal, age, city } = await setup();
  const q = await quote({ lineItems:[{ kind:'dhabaeh', animalId: animal.id, ageId: age.id, cuts:['CUT1'], packaging:['PK1'], cooking:['CK1'], sides:['SD1'] }], context:{ mode:'standalone', cityId: city.id, deliveryMethod:'home' } });
  // Base: 200 * 10kg = 2000
  // cut per_kg: 50*10=500 => 2500
  // packaging per_unit: 300 => 2800
  // cooking flat: 200 => 3000
  // side pct_of_base (based on base at time of application - spec ambiguous; we implemented sequential accumulation), implementation uses running base: after previous adds base=3000; pct 10% => 300 => final 3300
  expect(q.items[0].breakdown.base).toBe(3300);
  const side = q.items[0].breakdown.modifiers.find((m:any)=> m.kind==='side');
  expect(side.amount).toBe(300);
});
