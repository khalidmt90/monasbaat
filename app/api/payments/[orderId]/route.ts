import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureOrderOwner } from '@/lib/api-user';

// GET /api/payments/:orderId - list payment intents for an order (owner or admin)
export async function GET(_:Request, ctx:{ params:{ orderId:string } }){
  const { orderId } = ctx.params;
  const ownership = await ensureOrderOwner(orderId);
  if((ownership as any)?.json) return ownership as any;
  const intents = await prisma.paymentIntent.findMany({ where:{ orderId }, orderBy:{ createdAt:'asc' } });
  const masked = intents.map((pi:any)=>({ id:pi.id, status:pi.status, amountExpected:pi.amountExpected, amountReceived:pi.amountReceived, proofSubmittedAt:pi.proofSubmittedAt, createdAt:pi.createdAt, updatedAt:pi.updatedAt }));
  return NextResponse.json(masked);
}
