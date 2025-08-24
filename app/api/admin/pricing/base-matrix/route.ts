import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

function validate(row:any){
  if(!row.animalId||!row.ageId||!row.priceMode) return false;
  if(typeof row.unitPriceMinor !== 'number' || row.unitPriceMinor < 0) return false;
  return true;
}

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try{
    const { action, id, ...data } = await req.json();
    if(action==='create'){
      if(!validate(data)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.basePriceMatrix.create({ data });
      await prisma.auditLog.create({ data:{ action:'pricing_base_create', entity:'BasePriceMatrix', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='update'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      if(data.unitPriceMinor!=null && data.unitPriceMinor < 0) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.basePriceMatrix.update({ where:{ id }, data });
      await prisma.auditLog.create({ data:{ action:'pricing_base_update', entity:'BasePriceMatrix', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='delete'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      await prisma.basePriceMatrix.update({ where:{ id }, data:{ isActive:false } });
      await prisma.auditLog.create({ data:{ action:'pricing_base_soft_delete', entity:'BasePriceMatrix', entityId: id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  }catch(e:any){
    if(e.code==='P2002') return NextResponse.json({ error:'duplicate'},{ status:409 });
    return NextResponse.json({ error:'pricing_base_op_failed'},{ status:500 });
  }
}
