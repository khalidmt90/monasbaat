import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
import { ensureAuthenticated } from '@/lib/api-user';

// GET /api/orders - list current user's orders
export async function GET(req:Request){
  const user = await ensureAuthenticated(req) as any;
  if(user && typeof user === 'object' && 'status' in user && 'json' in user){
    return user;
  }
  const u = user;
  const rows = await prisma.order.findMany({ where:{ userId: u.id }, orderBy:{ createdAt:'desc' }, select:{ id:true, orderRef:true, status:true, totalsJson:true, expiresAt:true, createdAt:true, customerName:true, customerEmail:true, customerPhone:true } });
  return NextResponse.json(rows);
}
