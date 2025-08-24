import { test, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { deriveWeightAndBand } from '@/lib/pricing';
import { loadCatalog } from '@/lib/catalog';
import { nextCounter } from '@/lib/counters';

beforeAll(async () => {
  // seed minimal animal/age/sizeBand/mapping if not exists
  const animal = await prisma.animal.upsert({ where:{ code:'TEST_ANIMAL' }, update:{}, create:{ code:'TEST_ANIMAL', nameAr:'حيوان', nameEn:'Animal' } });
  const age = await prisma.age.upsert({ where:{ id: (await prisma.age.findFirst({ where:{ animalId: animal.id } }))?.id || 'skip' }, update:{}, create:{ animalId: animal.id, code:'A1', nameAr:'عمر', nameEn:'Age' } }).catch(async ()=>{
    return await prisma.age.create({ data:{ animalId: animal.id, code:'A1', nameAr:'عمر', nameEn:'Age' } });
  });
  const band = await prisma.sizeBand.upsert({ where:{ id: (await prisma.sizeBand.findFirst({ where:{ animalId:animal.id } }))?.id || 'skip' }, update:{}, create:{ animalId: animal.id, code:'SB1', labelAr:'شريحة', labelEn:'Band' } }).catch(async ()=>{
    return await prisma.sizeBand.create({ data:{ animalId: animal.id, code:'SB1', labelAr:'شريحة', labelEn:'Band' } });
  });
  await prisma.ageWeightMapping.upsert({ where:{ id: (await prisma.ageWeightMapping.findFirst({ where:{ animalType: animal.code, ageId: age.id } }))?.id || 'skip' }, update:{ sizeBandId: band.id, estimatedWeightKg: 50, basePriceModifier: 10 }, create:{ animalType: animal.code, animalId: animal.id, ageId: age.id, sizeBandId: band.id, estimatedWeightKg:50, basePriceModifier:10 } }).catch(async ()=>{
    await prisma.ageWeightMapping.create({ data:{ animalType: animal.code, animalId: animal.id, ageId: age.id, sizeBandId: band.id, estimatedWeightKg:50, basePriceModifier:10 } });
  });
});

test('deriveWeightAndBand returns mapping values', async () => {
  const catalog = await loadCatalog();
  const animal = catalog.animals.find(a=>a.code==='TEST_ANIMAL');
  const age = catalog.ages.find(a=> a.code==='A1' && a.animalId===animal?.id);
  expect(animal).toBeTruthy();
  expect(age).toBeTruthy();
  const res = deriveWeightAndBand({ animalId: animal!.id, ageId: age!.id }, catalog);
  expect(res.sizeBandId).toBeTruthy();
  expect(res.estimatedWeightKg).toBe(50);
  expect(res.basePriceModifier).toBe(10);
});
