import { test, expect } from 'vitest';
import { prisma } from '@/lib/prisma';
import { makeReq, createTestUser } from './helpers/api';
import * as createOrderRoute from '@/app/api/checkout/create-order/route';

async function createSlot(){
  const hall = await prisma.hall.findFirst();
  return prisma.hallSlot.create({ data:{ hallId: hall!.id, date:new Date(Date.now()+86400000*4), startTime:'20:00', endTime:'22:00', status:'open' } });
}

test('resume fetch returns same totals and masked payment intent', async () => {
  const user = await createTestUser('USER');
  const slot = await createSlot();
  const payload = { customer:{ name:'Res', phone:'050', email:'res@test.local' }, context:{ mode:'halls', deliveryMethod:'hall', cityId:'riyadh' }, lineItems:[{ kind:'hall_slot', slotId: slot.id }], agreements:{ termsAccepted:true } };
  const req = makeReq('POST','/api/checkout/create-order', payload, user);
  const res:any = await createOrderRoute.POST(req as any); const created = await res.json();
  const orderId = created.order_id;
  const orderRoute = await import('@/app/api/orders/[id]/route');
  const getReq = makeReq('GET',`/api/orders/${orderId}`, undefined, user);
  const getRes:any = await orderRoute.GET(getReq as any, { params:{ id: orderId } }); const fetched = await getRes.json();
  expect(fetched?.totalsJson?.total).toBe((await prisma.order.findUnique({ where:{ id: orderId } }))?.totalsJson?.total);
  // payment intent masked (no bankRef field exposed)
  const pi = fetched.paymentIntents[0];
  expect(pi).toBeDefined();
  expect(pi.bankRef).toBeUndefined();
});
