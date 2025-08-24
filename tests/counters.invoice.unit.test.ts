import { test, expect } from 'vitest';
import { prisma } from '@/lib/prisma';

// Test helper type to narrow the shape of order.totalsJson for TS
type OrderTotals = { total?: number; net?: number; vat?: number };
import { makeReq, createTestUser } from './helpers/api';
import * as createOrderRoute from '@/app/api/checkout/create-order/route';
import * as markReceivedRoute from '@/app/api/admin/payments/mark-received/route';

async function createSimpleOrder(user:any){
  // Reuse seed slot (create a new one for isolation)
  const seedHall = await prisma.hall.findFirst();
  const slot = await prisma.hallSlot.create({ data:{ hallId: seedHall!.id, date:new Date(Date.now()+86400000+Math.random()*1000), startTime:'12:00', endTime:'14:00', status:'open' } });
  const payload = { customer:{ name:'X', phone:'050', email:'x@test.local' }, context:{ mode:'halls', deliveryMethod:'hall', cityId:'riyadh' }, lineItems:[{ kind:'hall_slot', slotId: slot.id }], agreements:{ termsAccepted:true } };
  const req = makeReq('POST','/api/checkout/create-order', payload, user);
  const res:any = await createOrderRoute.POST(req as any); const json = await res.json();
  return json.order_id as string;
}

test('invoice_no sequential across payments', async () => {
  const admin = await createTestUser('ADMIN');
  const user = await createTestUser('USER');
  // ensure counters start baseline
  // Capture existing invoices numeric max (do not reset counter to avoid uniqueness conflicts)
  const existing = await prisma.invoice.findMany();
  const prevMax = existing.length ? Math.max(...existing.map((i:any)=> parseInt(i.invoiceNo.replace(/[^0-9]/g,''),10))) : 0;
  const order1 = await createSimpleOrder(user); const order2 = await createSimpleOrder(user);
  for(const oid of [order1, order2]){
    const order = await prisma.order.findUnique({ where:{ id: oid } });
  const total = (order?.totalsJson as OrderTotals)?.total || 0;
    const payReq = makeReq('POST','/api/admin/payments/mark-received', { order_id: oid, received_amount: total }, admin);
    const payRes:any = await markReceivedRoute.POST(payReq as any); const payJson = await payRes.json();
    expect(payRes.status).toBe(200);
    expect(payJson.invoice_no).toMatch(/^INV/);
  }
  const invoices = await prisma.invoice.findMany({ orderBy:{ issuedAt:'asc' } });
  const newOnes = invoices.filter((i:any)=> parseInt(i.invoiceNo.replace(/[^0-9]/g,''),10) > prevMax);
  expect(newOnes.length).toBeGreaterThanOrEqual(2);
  const nums = newOnes.map((i:any)=> parseInt(i.invoiceNo.replace(/[^0-9]/g,''),10));
  for(let i=1;i<nums.length;i++) expect(nums[i]).toBeGreaterThan(nums[i-1]);
});
