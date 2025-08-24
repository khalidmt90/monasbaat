import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
import { ensureAdminApi } from '@/lib/api-admin';
import { nextCounter, formatSeq } from '@/lib/counters';

// Admin-only (role check TODO) Input: { order_id, received_amount, bank_ref, received_datetime, reviewer_id }
export async function POST(req:Request){
  const guard = await ensureAdminApi(req);
  if((guard as any)?.error){
    return NextResponse.json({ error:'forbidden'},{ status:403 });
  }
  try {
    const body = await req.json();
    const { order_id, received_amount, bank_ref, received_datetime, reviewer_id } = body;
    if(!order_id || received_amount == null) return NextResponse.json({ error:'missing_fields'},{ status:400 });
  const order = await prisma.order.findUnique({ where:{ id: order_id }, include:{ paymentIntents:true } });
    if(!order) return NextResponse.json({ error:'order_not_found'},{ status:404 });
    if(order.status!=='pending_payment') return NextResponse.json({ error:'invalid_status'},{ status:400 });
  const intent = order.paymentIntents[0];
    if(!intent) return NextResponse.json({ error:'intent_missing'},{ status:400 });

    // Basic amount validation (tolerance TBD)
    const expectedTotal = (order.totalsJson as any)?.total ?? ((order.totalsJson as any)?.net + (order.totalsJson as any)?.vat);
    if(received_amount !== expectedTotal){
      await prisma.paymentIntent.update({ where:{ id:intent.id }, data:{ status:'needs_attention', amountReceived: received_amount, bankRef: bank_ref, reviewedBy: reviewer_id }});
      await prisma.auditLog.create({ data:{ action:'payment_amount_mismatch', entity:'Order', entityId: order.id, actorId: reviewer_id, actorRole:'ADMIN', meta:{ received: received_amount, expected: expectedTotal } }} as any);
      return NextResponse.json({ status:'needs_attention', reason:'amount_mismatch' });
    }

  await prisma.paymentIntent.update({ where:{ id:intent.id }, data:{ status:'received', amountReceived: received_amount, bankRef: bank_ref, transferDatetime: received_datetime? new Date(received_datetime): null, reviewedBy: reviewer_id }});
  await prisma.order.update({ where:{ id: order.id }, data:{ status:'paid' } });
  await prisma.hallBooking.updateMany({ where:{ orderId: order.id }, data:{ status:'confirmed' } });
  await prisma.slotLock.deleteMany({ where:{ orderId: order.id } });
  // Idempotent invoice issuance: if already exists reuse
  let invoice = await prisma.invoice.findUnique({ where:{ orderId: order.id } });
  if(!invoice){
    let attempts=0; const max=3;
    while(!invoice && attempts < max){
      attempts++;
      try {
        const seq = await nextCounter('invoice_no');
        const invoiceNo = formatSeq('INV', seq, 5);
        invoice = await prisma.invoice.create({ data:{ orderId: order.id, invoiceNo, totalsJson: order.totalsJson as any, vatLines: order.taxLines as any, status:'issued', issuedAt: new Date() }});
        await prisma.auditLog.create({ data:{ action:'order_paid', entity:'Order', entityId: order.id, actorId: reviewer_id, actorRole:'ADMIN', meta:{ invoiceNo: invoice.invoiceNo } }} as any);
      } catch(e:any){
        if(e?.code === 'P2002' && attempts < max){ continue; }
        throw e;
      }
    }
  }
  if(!invoice){
    console.error('mark-received: invoice_missing_after_create', order.id);
    return NextResponse.json({ error:'invoice_missing' }, { status:500 });
  }
  console.log('mark-received: returning invoice', invoice.invoiceNo);
  return NextResponse.json({ status:'paid', invoice_no: invoice.invoiceNo });
  } catch(e){
    console.error(e);
    return NextResponse.json({ error:'mark_received_failed'},{ status:500 });
  }
}
