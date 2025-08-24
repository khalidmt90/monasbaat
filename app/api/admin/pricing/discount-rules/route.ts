import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

function validate(data:any){
  if(!data.name||!data.scope) return false;
  if(typeof data.priority!=='number') return false;
  // basic checks for condition/action shapes
  return true;
}

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try{
    const { action, id, toggleActive, ...data } = await req.json();
    if(action==='create'){
      if(!validate(data)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.discountRule.create({ data });
      await prisma.auditLog.create({ data:{ action:'pricing_discount_create', entity:'DiscountRule', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='update'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      if(!validate(data)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.discountRule.update({ where:{ id }, data });
      await prisma.auditLog.create({ data:{ action:'pricing_discount_update', entity:'DiscountRule', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='toggle'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      const row = await prisma.discountRule.update({ where:{ id }, data:{ active: toggleActive } });
      await prisma.auditLog.create({ data:{ action:'pricing_discount_toggle', entity:'DiscountRule', entityId: row.id, meta:{ active: row.active } } });
      return NextResponse.json(row);
    }
    if(action==='delete'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      await prisma.discountRule.update({ where:{ id }, data:{ active:false } });
      await prisma.auditLog.create({ data:{ action:'pricing_discount_soft_delete', entity:'DiscountRule', entityId: id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  }catch(e){
    return NextResponse.json({ error:'pricing_discount_op_failed'},{ status:500 });
  }
}
