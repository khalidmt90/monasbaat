import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
import { ensureOrderOwner } from '@/lib/api-user';

// GET /api/orders/:id - fetch order if owner (or admin)
export async function GET(req:Request, ctx:{ params:{ id:string } }){
  const { id } = ctx.params;
  const ownership = await ensureOrderOwner(id, req) as any;
  // ensureOrderOwner returns NextResponse on failure; detect by presence of status property and json method
  if(ownership && typeof ownership === 'object' && 'status' in ownership && 'json' in ownership){
    return ownership;
  }
  const order = await prisma.order.findUnique({ where:{ id }, include:{ items:true, paymentIntents:true } });
  if(!order) return NextResponse.json({ error:'not_found'},{ status:404 });
  // Mask sensitive fields in payment intents
  const masked = { ...order, paymentIntents: order.paymentIntents.map((pi:any)=>({ id:pi.id, status:pi.status, amountExpected:pi.amountExpected, amountReceived:pi.amountReceived, proofSubmittedAt:pi.proofSubmittedAt, createdAt:pi.createdAt, updatedAt:pi.updatedAt })) };
  return NextResponse.json(masked);
}
