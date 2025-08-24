import { expect, test, beforeAll, afterAll } from 'vitest';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
let slotId: string;

beforeAll(async () => {
  const hall = await prisma.hall.create({ data:{ slug:`race-${Date.now()}`, name:'Race Hall', city:'Riyadh', basePrice:1000, sessions:[], amenities:[], images:[] } });
  const slot = await prisma.hallSlot.create({ data:{ hallId: hall.id, date:new Date(Date.now()+86400000), startTime:'17:00', endTime:'19:00', status:'open' } });
  slotId = slot.id;
});

afterAll(async ()=>{ await prisma.$disconnect(); });

async function attemptLock(){
  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const existing = await tx.slotLock.findUnique({ where:{ slotId } });
      if(existing) throw Object.assign(new Error('slot_conflict'), { code:'SLOT_CONFLICT' });
      const upd = await tx.hallSlot.updateMany({ where:{ id: slotId, status:'open' }, data:{ status:'closed' } });
      if(upd.count === 0) throw Object.assign(new Error('slot_conflict'), { code:'SLOT_CONFLICT' });
      const order = await tx.order.create({ data:{ status:'pending_payment' } });
      await tx.slotLock.create({ data:{ slotId, orderId: order.id } });
    });
    return true;
  } catch { return false; }
}

test('race: only one succeeds', async () => {
  const [a,b] = await Promise.all([attemptLock(), attemptLock()]);
  expect(a !== b).toBe(true); // one true, one false
  const slot = await prisma.hallSlot.findUnique({ where:{ id: slotId } });
  expect(slot?.status).toBe('closed');
});
