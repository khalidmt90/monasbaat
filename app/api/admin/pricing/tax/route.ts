import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try{
    const { vatPercent } = await req.json();
    if(typeof vatPercent!=='number' || vatPercent<0 || vatPercent>10000) return NextResponse.json({ error:'validation'},{ status:400 });
    // deactivate existing
    await prisma.taxSetting.updateMany({ where:{ isActive:true }, data:{ isActive:false } });
    const row = await prisma.taxSetting.create({ data:{ vatPercent } });
    await prisma.auditLog.create({ data:{ action:'pricing_tax_upsert', entity:'TaxSetting', entityId: row.id } });
    return NextResponse.json(row);
  }catch(e){
    return NextResponse.json({ error:'pricing_tax_upsert_failed'},{ status:500 });
  }
}
