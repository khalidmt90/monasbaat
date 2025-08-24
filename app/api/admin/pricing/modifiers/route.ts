import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

function validate(data:any){
  if(!data.kind||!data.refId||!data.calcType) return false;
  if(data.calcType==='pct_of_base'){
    if(typeof data.pctBps !== 'number' || data.pctBps <0 || data.pctBps>10000) return false;
  } else {
    if(typeof data.amountMinor !== 'number' || data.amountMinor <0) return false;
  }
  return true;
}

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try{
    const { action, id, ...data } = await req.json();
    if(action==='create'){
      if(!validate(data)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.modifierPrice.create({ data });
      await prisma.auditLog.create({ data:{ action:'pricing_modifier_create', entity:'ModifierPrice', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='update'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      if(!validate(data)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.modifierPrice.update({ where:{ id }, data });
      await prisma.auditLog.create({ data:{ action:'pricing_modifier_update', entity:'ModifierPrice', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='delete'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      await prisma.modifierPrice.update({ where:{ id }, data:{ isActive:false } });
      await prisma.auditLog.create({ data:{ action:'pricing_modifier_soft_delete', entity:'ModifierPrice', entityId: id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  }catch(e){
    return NextResponse.json({ error:'pricing_modifier_op_failed'},{ status:500 });
  }
}
