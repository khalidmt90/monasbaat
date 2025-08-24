import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action') || undefined;
  const actorId = url.searchParams.get('actorId') || undefined;
  const entity = url.searchParams.get('entity') || undefined;
  const from = url.searchParams.get('from') ? new Date(url.searchParams.get('from')!) : undefined;
  const to = url.searchParams.get('to') ? new Date(url.searchParams.get('to')!) : undefined;

  const where: any = {};
  if (action) where.action = action;
  if (actorId) where.actorId = actorId;
  if (entity) where.entity = entity;
  if (from || to) where.createdAt = {};
  if (from) where.createdAt.gte = from;
  if (to) where.createdAt.lte = to;

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return NextResponse.json({ data: logs });
}
