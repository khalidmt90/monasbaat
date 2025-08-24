import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureOrderOwner } from '@/lib/api-user';

// Simplified proof submission (metadata only; file upload storage TBD)
// Input: { order_id, transfer_proof_meta:{ filename,size,mime }, payer_name, payer_bank, transfer_datetime_iso, amount_sent, notes }
export async function POST(req:Request){
  try {
    const body = await req.json();
    const { order_id, payer_name, payer_bank, transfer_datetime_iso, amount_sent } = body;
    if(!order_id) return NextResponse.json({ error:'missing_order_id'},{ status:400 });
  const ownership = await ensureOrderOwner(order_id as string, req);
  if((ownership as any)?.json) return ownership as any; // error response
  let order = (ownership as any).order || await prisma.order.findUnique({ where:{ id: order_id } });
  if(order && (order as any).status === undefined){
    order = await prisma.order.findUnique({ where:{ id: order_id } });
  }
    if(!order) return NextResponse.json({ error:'order_not_found'},{ status:404 });
    if(order.status!=='pending_payment') return NextResponse.json({ error:'invalid_status'},{ status:400 });
  const intent = await prisma.paymentIntent.findFirst({ where:{ orderId: order.id }, orderBy:{ createdAt:'asc' }});
    if(!intent) return NextResponse.json({ error:'payment_intent_missing'},{ status:400 });
  const updated = await prisma.paymentIntent.update({ where:{ id:intent.id }, data:{ status:'submitted', amountReceived: amount_sent||null, payerName: payer_name, payerBank: payer_bank, transferDatetime: transfer_datetime_iso? new Date(transfer_datetime_iso): null, notes: body.notes, proofUrl: body.transfer_proof_meta?.filename || null, proofSubmittedAt:new Date(), proofMeta: body.meta || {} } });
  await prisma.auditLog.create({ data:{ action:'proof_submitted', entity:'PaymentIntent', entityId:intent.id, meta:{ orderId:intent.orderId, meta: body.meta || {} } } });
  return NextResponse.json({ receipt_id: updated.id, review_eta: '24h' });
  } catch(e){
    console.error(e);
    return NextResponse.json({ error:'proof_failed'},{ status:500 });
  }
}
