import { test, expect } from 'vitest';
import { prisma } from '@/lib/prisma';

type OrderTotals = { total?: number; net?: number; vat?: number };
import { makeReq, createTestUser } from './helpers/api';
import * as createOrderRoute from '@/app/api/checkout/create-order/route';
import * as proofRoute from '@/app/api/payments/bank-transfer/proof/route';
import * as markReceivedRoute from '@/app/api/admin/payments/mark-received/route';

async function createSlot(){
  const hall = await prisma.hall.findFirst();
  const rnd = Math.floor(Math.random()*1000);
  return prisma.hallSlot.create({ data:{ hallId: hall!.id, date:new Date(Date.now()+86400000*2), startTime:('0'+(10+(rnd%8))).slice(-2)+':00', endTime:('0'+(12+(rnd%8))).slice(-2)+':00', status:'open' } });
}

async function createHallOrder(user:any){
  const slot = await createSlot();
  const payload = { customer:{ name:'Neg', phone:'050', email:'neg@test.local' }, context:{ mode:'halls', deliveryMethod:'hall', cityId:'riyadh' }, lineItems:[{ kind:'hall_slot', slotId: slot.id }], agreements:{ termsAccepted:true } };
  const req = makeReq('POST','/api/checkout/create-order', payload, user);
  const res:any = await createOrderRoute.POST(req as any); const json = await res.json();
  expect(res.status).toBe(200);
  return json.order_id as string;
}

test('second mark-received attempt rejected', async () => {
  const admin = await createTestUser('ADMIN');
  const user = await createTestUser('USER');
  const orderId = await createHallOrder(user);
  const order = await prisma.order.findUnique({ where:{ id: orderId } });
  const total = (order?.totalsJson as OrderTotals)?.total || 0;
  const payReq1 = makeReq('POST','/api/admin/payments/mark-received', { order_id: orderId, received_amount: total }, admin);
  const payRes1:any = await markReceivedRoute.POST(payReq1 as any); const body1 = await payRes1.json();
  expect(payRes1.status).toBe(200);
  expect(body1.invoice_no).toMatch(/^INV/);
  const payReq2 = makeReq('POST','/api/admin/payments/mark-received', { order_id: orderId, received_amount: total }, admin);
  const payRes2:any = await markReceivedRoute.POST(payReq2 as any); const body2 = await payRes2.json();
  expect(payRes2.status).toBe(400);
  expect(body2.error).toBe('invalid_status');
});

test('proof after payment rejected', async () => {
  const admin = await createTestUser('ADMIN');
  const user = await createTestUser('USER');
  const orderId = await createHallOrder(user);
  const order = await prisma.order.findUnique({ where:{ id: orderId } });
  const total = (order?.totalsJson as any)?.total || 0;
  // Pay first
  const payReq = makeReq('POST','/api/admin/payments/mark-received', { order_id: orderId, received_amount: total }, admin);
  const payRes:any = await markReceivedRoute.POST(payReq as any); expect(payRes.status).toBe(200);
  // Attempt proof submission
  const intent = await prisma.paymentIntent.findFirst({ where:{ orderId } });
  const proofReq = makeReq('POST','/api/payments/bank-transfer/proof', { order_id: orderId, transfer_proof_meta:{ filename:'later.txt', size:5, mime:'text/plain' } }, user);
  const proofRes:any = await proofRoute.POST(proofReq as any); const proofJson = await proofRes.json();
  expect(proofRes.status).toBe(400);
  expect(proofJson.error).toBe('invalid_status');
});

test('proof missing order id', async () => {
  const user = await createTestUser('USER');
  const proofReq = makeReq('POST','/api/payments/bank-transfer/proof', { }, user);
  const proofRes:any = await proofRoute.POST(proofReq as any); const proofJson = await proofRes.json();
  expect(proofRes.status).toBe(400);
  expect(proofJson.error).toBe('missing_order_id');
});
