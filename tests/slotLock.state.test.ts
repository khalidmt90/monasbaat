import { expect, test, beforeAll, afterAll } from 'vitest';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
let slotId: string; let orderA: string; let orderB: string;

beforeAll(async () => {
  // Create hall + slot
  const hall = await prisma.hall.create({ data:{ slug:`h-${Date.now()}`, name:'Test Hall', city:'Riyadh', basePrice:1000, sessions:[], amenities:[], images:[] } });
  const slot = await prisma.hallSlot.create({ data:{ hallId: hall.id, date:new Date(Date.now()+86400000), startTime:'18:00', endTime:'22:00', status: 'open' } });
  slotId = slot.id;
});

afterAll(async ()=>{ await prisma.$disconnect(); });

test('open -> closed via SlotLock', async () => {
  const newOrderId = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const existing = await tx.slotLock.findUnique({ where:{ slotId } });
    expect(existing).toBeNull();
    const upd = await tx.hallSlot.updateMany({ where:{ id: slotId, status:'open' }, data:{ status:'closed' } });
    expect(upd.count).toBe(1);
    const order = await tx.order.create({ data:{ status:'pending_payment' } });
    await tx.slotLock.create({ data:{ slotId, orderId: order.id } });
    return order.id;
  });
  orderA = newOrderId;
  const slot = await prisma.hallSlot.findUnique({ where:{ id: slotId } });
  expect(slot?.status).toBe('closed');
});

test('second lock attempt fails', async () => {
  await expect(prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const existing = await tx.slotLock.findUnique({ where:{ slotId } });
    if(existing) throw Object.assign(new Error('slot_conflict'), { code:'SLOT_CONFLICT' });
  })).rejects.toThrowError();
});

test('cancel -> unlock', async () => {
  await prisma.order.update({ where:{ id: orderA }, data:{ status:'cancelled_unpaid' } });
  await prisma.slotLock.delete({ where:{ slotId } }).catch(()=>{});
  await prisma.hallSlot.update({ where:{ id: slotId }, data:{ status:'open' } });
  const slot = await prisma.hallSlot.findUnique({ where:{ id: slotId } });
  expect(slot?.status).toBe('open');
});

test('paid -> final closed', async () => {
  // Relock for paid scenario
  const o = await prisma.order.create({ data:{ status:'pending_payment' } });
  orderB = o.id;
  await prisma.hallSlot.update({ where:{ id: slotId }, data:{ status:'closed' } });
  await prisma.slotLock.create({ data:{ slotId, orderId: orderB } });
  await prisma.order.update({ where:{ id: orderB }, data:{ status:'paid' } });
  await prisma.slotLock.deleteMany({ where:{ orderId: orderB } });
  const slot = await prisma.hallSlot.findUnique({ where:{ id: slotId } });
  expect(slot?.status).toBe('closed');
});
