import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

export async function GET(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  const [ cities, branches, windows, cutoffs, capacities ] = await Promise.all([
    prisma.city.findMany({ orderBy:{ code:'asc' } }),
    prisma.branch.findMany({ orderBy:{ code:'asc' } }),
    prisma.deliveryWindow.findMany({ orderBy:{ cityId:'asc' } }),
    prisma.cutoffRule.findMany({ orderBy:{ cityId:'asc' } }),
    prisma.slotCapacity.findMany({ orderBy:{ cityId:'asc' } }),
  ]);
  return NextResponse.json({ cities, branches, deliveryWindows: windows, cutoffRules: cutoffs, slotCapacities: capacities });
}
