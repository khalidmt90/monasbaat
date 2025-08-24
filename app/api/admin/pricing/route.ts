import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

export async function GET(){
  const [baseMatrix, modifiers, deliveryFees, tax, discounts] = await Promise.all([
    prisma.basePriceMatrix.findMany({ where:{ isActive:true } }),
    prisma.modifierPrice.findMany({ where:{ isActive:true } }),
    prisma.pricingDeliveryFee.findMany({ where:{ isActive:true } }),
    prisma.taxSetting.findFirst({ where:{ isActive:true } }),
    prisma.discountRule.findMany({ where:{ active:true }, orderBy:{ priority:'asc' } })
  ]);
  return NextResponse.json({ baseMatrix, modifiers, deliveryFees, tax, discounts });
}

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  return NextResponse.json({ ok:true });
}
