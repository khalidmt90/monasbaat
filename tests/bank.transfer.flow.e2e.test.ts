import { test, expect } from 'vitest';
import { makeReq, createTestUser } from './helpers/api';
import { prisma } from '@/lib/prisma';

type OrderTotals = { total?: number; net?: number; vat?: number };
import * as createOrderRoute from '@/app/api/checkout/create-order/route';
import * as proofRoute from '@/app/api/payments/bank-transfer/proof/route';
import * as markReceivedRoute from '@/app/api/admin/payments/mark-received/route';

async function createSlot(){
  const hall = await prisma.hall.findFirst();
  const baseDate = new Date(Date.now()+86400000*3);
  const rnd = Math.floor(Math.random()*60);
  const start = String(10 + (rnd%8)).padStart(2,'0')+':00';
  const end = String(12 + (rnd%8)).padStart(2,'0')+':00';
  return prisma.hallSlot.create({ data:{ hallId: hall!.id, date: baseDate, startTime:start, endTime:end, status:'open' } });
}

test('bank transfer full flow with invoice sequential', async () => {
  const user = await createTestUser('USER');
  const admin = await createTestUser('ADMIN');
  const slot = await createSlot();
  const payload = { customer:{ name:'Buyer', phone:'050', email:'buyer@test.local' }, context:{ mode:'halls', deliveryMethod:'hall', cityId:'riyadh' }, lineItems:[{ kind:'hall_slot', slotId: slot.id }], agreements:{ termsAccepted:true } };
  const createReq = makeReq('POST','/api/checkout/create-order', payload, user);
  const createRes:any = await createOrderRoute.POST(createReq as any); const created = await createRes.json();
  if(createRes.status !== 200){
    console.error('create-order failed', createRes.status, created);
  }
  expect(createRes.status).toBe(200);
  expect(created.bankInstructions?.reference).toBe(created.order_ref);
  // Submit proof (metadata only)
  const orderPre = await prisma.order.findUnique({ where:{ id: created.order_id } });
  const intent = await prisma.paymentIntent.findFirst({ where:{ orderId: created.order_id } });
  const dbOrder = await prisma.order.findUnique({ where:{ id: created.order_id } });
  const proofReq = makeReq('POST','/api/payments/bank-transfer/proof', { order_id: created.order_id, transfer_proof_meta:{ filename:`proof-${intent!.id}.txt`, size:10, mime:'text/plain' }, payer_name:'Buyer', payer_bank:'Bank', amount_sent:(dbOrder?.totalsJson as OrderTotals)?.total }, user);
  const proofRes:any = await proofRoute.POST(proofReq as any); const proofJson = await proofRes.json();
  expect(proofRes.status).toBe(200);
  expect(proofJson.receipt_id).toBeTruthy();
  // Mark received (paid)
  const order = await prisma.order.findUnique({ where:{ id: created.order_id } });
  const total = (order?.totalsJson as OrderTotals)?.total || 0;
  const payReq = makeReq('POST','/api/admin/payments/mark-received', { order_id: created.order_id, received_amount: total }, admin);
  const payRes:any = await markReceivedRoute.POST(payReq as any); const payJson = await payRes.json();
  expect(payRes.status).toBe(200);
  expect(payJson.invoice_no).toMatch(/^INV/);
});
