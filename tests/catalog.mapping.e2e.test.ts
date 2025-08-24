import { test, expect } from 'vitest';
import { prisma } from '@/lib/prisma';
import { loadCatalog } from '@/lib/catalog';
import { deriveWeightAndBand } from '@/lib/pricing';

async function superReq(path:string, body:any){
  const headers = new Headers({ 'x-test-user':'super', 'x-test-role':'super_admin','content-type':'application/json' });
  return fetch('http://localhost'+path, { method:'POST', headers, body: JSON.stringify(body) } as any);
}

// NOTE: This E2E test assumes in-process route invocation not network; adapt if needed.

test('mapping update affects deriveWeightAndBand', async () => {
  const animal = await prisma.animal.upsert({ where:{ code:'E2E_ANIMAL' }, update:{}, create:{ code:'E2E_ANIMAL', nameAr:'حيوان', nameEn:'Animal' } });
  const age = await prisma.age.upsert({ where:{ id: (await prisma.age.findFirst({ where:{ animalId: animal.id, code:'E2E_AGE' } }))?.id || '___missing___' }, update:{}, create:{ animalId: animal.id, code:'E2E_AGE', nameAr:'عمر', nameEn:'Age' } }).catch(async()=>{
    return prisma.age.findFirst({ where:{ animalId:animal.id, code:'E2E_AGE' } }) as any;
  });
  const band = await prisma.sizeBand.upsert({ where:{ id: (await prisma.sizeBand.findFirst({ where:{ animalId: animal.id, code:'E2E_SB' } }))?.id || '___missing___' }, update:{}, create:{ animalId: animal.id, code:'E2E_SB', labelAr:'شريحة', labelEn:'Band' } }).catch(async()=>{
    return prisma.sizeBand.findFirst({ where:{ animalId:animal.id, code:'E2E_SB' } }) as any;
  });
  // Upsert mapping via API handler directly (import)
  const { POST } = await import('@/app/api/admin/catalog/mapping/route');
  const req = new Request('http://localhost/api/admin/catalog/mapping',{ method:'POST', headers: new Headers({ 'x-test-user':'super', 'x-test-role':'super_admin','content-type':'application/json' }), body: JSON.stringify({ action:'upsert', rows:[{ animalType: animal.code, animalId: animal.id, ageId: age.id, sizeBandId: band.id, estimatedWeightKg:70, basePriceModifier:5 }] }) });
  const res = await POST(req as any);
  expect((res as any).status).toBe(200);
  const catalog = await loadCatalog();
  const derived = deriveWeightAndBand({ animalId: animal.id, ageId: age.id }, catalog);
  expect(derived.estimatedWeightKg).toBe(70);
  expect(derived.basePriceModifier).toBe(5);
});
