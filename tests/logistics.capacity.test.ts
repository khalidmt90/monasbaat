import { test, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { resolveCapacity } from '@/lib/logistics';

let cityId:string;

beforeAll(async () => {
  const city = await prisma.city.upsert({ where:{ code:'CAP' }, update:{}, create:{ code:'CAP', nameAr:'سعة', nameEn:'Capacity' } });
  cityId = city.id;
  const existing = await prisma.slotCapacity.findMany({ where:{ cityId } });
  if(existing.length===0){
    await prisma.slotCapacity.create({ data:{ cityId, dayOfWeek: 0, startMin: 8*60, endMin: 12*60, capacity: 5 } });
    await prisma.slotCapacity.create({ data:{ cityId, dayOfWeek: 0, startMin: 12*60, endMin: 18*60, capacity: 10 } });
  }
});

test('capacity resolves correct segment', async () => {
  const c1 = await resolveCapacity(cityId, 0, 9*60);
  const c2 = await resolveCapacity(cityId, 0, 13*60);
  expect(c1).toBe(5);
  expect(c2).toBe(10);
});
