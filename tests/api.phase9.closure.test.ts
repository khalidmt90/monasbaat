import { beforeAll, afterAll, test, expect } from 'vitest';
import { prisma } from '../lib/prisma';

type OrderTotals = { total?: number; net?: number; vat?: number };
import { makeReq } from './helpers/api';
import { getSeedIds } from '../vitest.setup';
import * as createOrderRoute from '../app/api/checkout/create-order/route';
import * as markReceivedRoute from '../app/api/admin/payments/mark-received/route';
import * as cancelExpiredRoute from '../app/api/admin/orders/cancel-expired/route';
import * as proofDownloadRoute from '../app/api/uploads/proof/[id]/route';
import fs from 'fs';
import path from 'path';

let ids:any; let userA:any; let userB:any; let superAdmin:any; let admin:any;

beforeAll(async () => {
  ids = await getSeedIds();
  userA = { id: ids.userA, role:'USER', email:'userA@test.local' };
  userB = { id: ids.userB, role:'USER', email:'userB@test.local' };
  superAdmin = { id: ids.superAdmin, role:'SUPER_ADMIN', email:'super@test.local' };
  // Use superAdmin as admin test user for guard (simulate ADMIN)
  admin = { id: ids.superAdmin, role:'ADMIN', email:'super@test.local' };
});

afterAll(async ()=>{ await prisma.$disconnect(); });

async function createSlot(){
  // Reuse existing hall; create a new slot for isolation
  const hallId = ids.hall;
  const slot = await prisma.hallSlot.create({ data:{ hallId, date:new Date(Date.now()+3600_1000*24+Math.random()*1000), startTime:'18:00', endTime:'22:00', status:'open' } });
  return { hall:{ id: hallId }, slot };
}

function buildOrderPayload(slotId:string){
  return { customer:{ name:'Alice', phone:'0500000000', email:'alice@example.com' }, context:{ mode:'halls', deliveryMethod:'hall', cityId:'riyadh' }, lineItems:[ { kind:'hall_slot', slotId } ], agreements:{ termsAccepted:true } };
}

// 1. Sequential order_ref concurrency
test('order_ref increments without duplicates under concurrency', async () => {
  const { slot: slot1 } = await createSlot();
  const { slot: slot2 } = await createSlot();
  const payload1 = buildOrderPayload(slot1.id);
  const payload2 = buildOrderPayload(slot2.id);
  const req1 = makeReq('POST','/api/checkout/create-order', payload1, userA);
  const req2 = makeReq('POST','/api/checkout/create-order', payload2, userB);
  const [res1, res2] = await Promise.all([ createOrderRoute.POST(req1 as any), createOrderRoute.POST(req2 as any) ]);
  const j1:any = await (res1 as any).json();
  const j2:any = await (res2 as any).json();
  expect(j1.order_ref).toBeTruthy();
  expect(j2.order_ref).toBeTruthy();
  expect(j1.order_ref).not.toEqual(j2.order_ref);
});

// 2. Bank config values surfaced
test('create-order returns bank instructions from GlobalConfig', async () => {
  const { slot } = await createSlot();
  const payload = buildOrderPayload(slot.id);
  const req = makeReq('POST','/api/checkout/create-order', payload, userA);
  const res = await createOrderRoute.POST(req as any);
  const json:any = await (res as any).json();
  expect(json.bankInstructions.iban).toBe('SA00 TEST IBAN');
  expect(json.bankInstructions.beneficiary).toBe('Company Name');
});

// 3. Admin guard denies non-admin
test('non-admin cannot mark payment received', async () => {
  const req = makeReq('POST','/api/admin/payments/mark-received', { order_id:'x', received_amount:100 }, userA);
  const res = await markReceivedRoute.POST(req as any);
  expect((res as any).status).toBe(403);
});

test('non-admin cannot cancel expired orders', async () => {
  const req = makeReq('POST','/api/admin/orders/cancel-expired', {}, userA);
  const res = await cancelExpiredRoute.POST(req as any);
  expect((res as any).status).toBe(403);
});

// 4. Ownership: User A cannot access User B order
test('user ownership enforced and owner can access', async () => {
  const { slot } = await createSlot();
  const payload = buildOrderPayload(slot.id);
  const req = makeReq('POST','/api/checkout/create-order', payload, userA);
  const res = await createOrderRoute.POST(req as any); const json:any = await (res as any).json();
  // Owner fetch
  const orderRoute = await import('../app/api/orders/[id]/route');
  const ownerReq = makeReq('GET',`/api/orders/${json.order_id}`, undefined, userA);
  const ownerRes = await orderRoute.GET(ownerReq as any, { params:{ id: json.order_id } });
  expect((ownerRes as any).status).toBe(200);
  // Attempt fetch via order detail route with different user
  const detailReq = makeReq('GET',`/api/orders/${json.order_id}`, undefined, userB);
  const detailRes = await orderRoute.GET(detailReq as any, { params:{ id: json.order_id } });
  expect((detailRes as any).status).toBe(403);
});

test('orders list scoped to owner only', async () => {
  const { slot } = await createSlot();
  const payload = buildOrderPayload(slot.id);
  const req = makeReq('POST','/api/checkout/create-order', payload, userA);
  const res = await createOrderRoute.POST(req as any); const created:any = await (res as any).json();
  const targetOrderId = created.order_id;
  const listRoute = await import('../app/api/orders/route');
  const listReqA = makeReq('GET','/api/orders', undefined, userA);
  const listResA = await listRoute.GET(listReqA as any);
  const arrA = await (listResA as any).json();
  expect(arrA.some((o:any)=> o.id === targetOrderId)).toBe(true);
  const listReqB = makeReq('GET','/api/orders', undefined, userB);
  const listResB = await listRoute.GET(listReqB as any);
  const arrB = await (listResB as any).json();
  expect(arrB.some((o:any)=> o.id === targetOrderId)).toBe(false);
});

// 5. Invoice number increments on payment receipt
test('invoice_no increments when payment marked received', async () => {
  const { slot } = await createSlot();
  const payload = buildOrderPayload(slot.id);
  const req = makeReq('POST','/api/checkout/create-order', payload, userA);
  const res = await createOrderRoute.POST(req as any); const json:any = await (res as any).json();
  const order = await prisma.order.findUnique({ where:{ id: json.order_id } });
  const total = (order?.totalsJson as OrderTotals)?.total || 0;
  const payReq = makeReq('POST','/api/admin/payments/mark-received', { order_id: json.order_id, received_amount: total }, admin);
  const payRes = await markReceivedRoute.POST(payReq as any); const payJson:any = await (payRes as any).json();
  if(!payJson.invoice_no){
    console.error('invoice_no missing response', payJson);
  }
  expect(payJson.invoice_no).toMatch(/^INV/);
});

// 6. Proof ACL: owner 200, other user 403, super_admin 200, unknown file 404
test('proof ACL scenarios', async () => {
  // Create order & intent & file
  const order = await prisma.order.create({ data:{ status:'pending_payment', userId: userA.id } });
  const intent = await prisma.paymentIntent.create({ data:{ orderId: order.id, type:'bank_transfer', amountExpected:100 } });
  const filename = `${order.id}-p.txt`;
  const dir = path.join(process.cwd(),'storage','proofs'); await fs.promises.mkdir(dir,{ recursive:true });
  const filePath = path.join(dir, filename); await fs.promises.writeFile(filePath,'data');
  await prisma.paymentIntent.update({ where:{ id:intent.id }, data:{ proofUrl: `/api/uploads/proof/${filename}` } });
  // Owner
  const ownerReq = makeReq('GET',`/api/uploads/proof/${filename}`, undefined, userA);
  const ownerRes = await proofDownloadRoute.GET(ownerReq as any, { params:{ id: filename } });
  expect((ownerRes as any).status).toBe(200);
  // Other user
  const otherReq = makeReq('GET',`/api/uploads/proof/${filename}`, undefined, userB);
  const otherRes = await proofDownloadRoute.GET(otherReq as any, { params:{ id: filename } });
  expect((otherRes as any).status).toBe(403);
  // Super admin
  const superReq = makeReq('GET',`/api/uploads/proof/${filename}`, undefined, superAdmin);
  const superRes = await proofDownloadRoute.GET(superReq as any, { params:{ id: filename } });
  expect((superRes as any).status).toBe(200);
  // Missing file
  const missingReq = makeReq('GET','/api/uploads/proof/missing.txt', undefined, userA);
  const missingRes = await proofDownloadRoute.GET(missingReq as any, { params:{ id: 'missing.txt' } });
  expect((missingRes as any).status).toBe(404);
});

// 7. Auto-cancel unlocks slot + audit
test('auto-cancel releases slot and writes audit log', async () => {
  const { slot } = await createSlot();
  const payload = buildOrderPayload(slot.id);
  const req = makeReq('POST','/api/checkout/create-order', payload, userA);
  const res = await createOrderRoute.POST(req as any); const json:any = await (res as any).json();
  // Expire the order manually
  await prisma.order.update({ where:{ id: json.order_id }, data:{ expiresAt: new Date(Date.now()-1000) } });
  // Run cancel-expired as admin
  const cancelReq = makeReq('POST','/api/admin/orders/cancel-expired', {}, admin);
  const cancelRes = await cancelExpiredRoute.POST(cancelReq as any); const cancelJson:any = await (cancelRes as any).json();
  expect(cancelJson.slots_released).toBeGreaterThanOrEqual(1);
  const slotRow = await prisma.hallSlot.findUnique({ where:{ id: slot.id } });
  expect(slotRow?.status).toBe('open');
  const audit = await prisma.auditLog.findFirst({ where:{ action:'slot_unlock', entityId: slot.id } });
  expect(audit).toBeTruthy();
});
