import { test, expect } from 'vitest';
import { prisma } from '@/lib/prisma';

async function ensureFixture(){
  const animal = await prisma.animal.upsert({ where:{ code:'MAP_ANIMAL' }, update:{ active:true }, create:{ code:'MAP_ANIMAL', nameAr:'MapAnimal', active:true } });
  let age = await prisma.age.findFirst({ where:{ animalId: animal.id, code:'MAP_AGE' } });
  if(!age) age = await prisma.age.create({ data:{ animalId: animal.id, code:'MAP_AGE', nameAr:'MapAge', active:true } });
  let size = await prisma.sizeBand.findFirst({ where:{ animalId: animal.id, code:'MAP_SB' } });
  if(!size) size = await prisma.sizeBand.create({ data:{ animalId: animal.id, code:'MAP_SB', labelAr:'SB', active:true } });
  let mapping = await prisma.ageWeightMapping.findFirst({ where:{ animalId: animal.id, ageId: age.id } });
  if(!mapping){ mapping = await prisma.ageWeightMapping.create({ data:{ animalType: animal.code, animalId: animal.id, ageId: age.id, sizeBandId: size.id, estimatedWeightKg:5, basePriceModifier:250 } as any }); }
  return { animal, age, size, mapping };
}

test('mapping lookup returns sizeBand, weight, modifier basis points', async () => {
  const { animal, age, size, mapping } = await ensureFixture();
  const fetched = await prisma.ageWeightMapping.findFirst({ where:{ animalId: animal.id, ageId: age.id } });
  expect(fetched?.sizeBandId).toBe(size.id);
  expect(fetched?.estimatedWeightKg).toBe(5);
  expect(fetched?.basePriceModifier).toBe(250); // 2.5% in basis points
});
