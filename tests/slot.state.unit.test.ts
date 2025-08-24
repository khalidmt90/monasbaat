import { test, expect } from 'vitest';
import { prisma } from '@/lib/prisma';

type OrderTotals = { total?: number; net?: number; vat?: number };
import { makeReq, createTestUser } from './helpers/api';
import * as createOrderRoute from '@/app/api/checkout/create-order/route';
import * as cancelExpiredRoute from '@/app/api/admin/orders/cancel-expired/route';
import * as markReceivedRoute from '@/app/api/admin/payments/mark-received/route';

function buildOrderPayload(slotId:string){
  return { customer:{ name:'S', phone:'050', email:'s@test.local' }, context:{ mode:'halls', deliveryMethod:'hall', cityId:'riyadh' }, lineItems:[{ kind:'hall_slot', slotId }], agreements:{ termsAccepted:true } };
}

test('slot state machine open -> closed(pending) -> open(expired) -> closed(paid)', async () => {
  const hall = await prisma.hall.findFirst();
  const slot = await prisma.hallSlot.create({ data:{ hallId: hall!.id, date:new Date(Date.now()+86400000*2), startTime:'09:00', endTime:'11:00', status:'open' } });
  expect(slot.status).toBe('open');
  const user = await createTestUser('USER');
  const admin = await createTestUser('ADMIN');
  // Create order (closes slot)
  const req1 = makeReq('POST','/api/checkout/create-order', buildOrderPayload(slot.id), user);
  const res1:any = await createOrderRoute.POST(req1 as any); await res1.json();
  const closed = await prisma.hallSlot.findUnique({ where:{ id: slot.id } });
  expect(closed?.status).toBe('closed');
  // Expire & cancel -> reopen
  const order = await prisma.order.findFirst({ where:{ slotLocks:{ some:{ slotId: slot.id } } } });
  await prisma.order.update({ where:{ id: order!.id }, data:{ expiresAt: new Date(Date.now()-1000) } });
  const cancelReq = makeReq('POST','/api/admin/orders/cancel-expired', {}, admin);
  await cancelExpiredRoute.POST(cancelReq as any);
  const reopened = await prisma.hallSlot.findUnique({ where:{ id: slot.id } });
  expect(reopened?.status).toBe('open');
  // Create second order -> closed again
  const req2 = makeReq('POST','/api/checkout/create-order', buildOrderPayload(slot.id), user);
  const res2:any = await createOrderRoute.POST(req2 as any); const j2 = await res2.json();
  const closed2 = await prisma.hallSlot.findUnique({ where:{ id: slot.id } });
  expect(closed2?.status).toBe('closed');
  // Mark received (slot remains closed)
  const ord2 = await prisma.order.findUnique({ where:{ id: j2.order_id } });
  const total = (ord2?.totalsJson as OrderTotals)?.total || 0;
  const payReq = makeReq('POST','/api/admin/payments/mark-received', { order_id: j2.order_id, received_amount: total }, admin);
  await markReceivedRoute.POST(payReq as any);
  const finalSlot = await prisma.hallSlot.findUnique({ where:{ id: slot.id } });
  expect(finalSlot?.status).toBe('closed');
});
