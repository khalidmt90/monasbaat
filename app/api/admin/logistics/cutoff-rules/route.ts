import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

function validate(cityId?:string){ return !!cityId; }

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try{
    const { action, id, cityId, sameDayCutoffMin, nextDayCutoffMin, leadTimeHours, active } = await req.json();
    if(action==='create'){
      if(!validate(cityId)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.cutoffRule.create({ data:{ cityId, sameDayCutoffMin: sameDayCutoffMin??0, nextDayCutoffMin: nextDayCutoffMin??0, leadTimeHours: leadTimeHours??0 } });
      await prisma.auditLog.create({ data:{ action:'cutoff_rule_create', entity:'CutoffRule', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='update'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      const row = await prisma.cutoffRule.update({ where:{ id }, data:{ sameDayCutoffMin, nextDayCutoffMin, leadTimeHours, active } });
      await prisma.auditLog.create({ data:{ action:'cutoff_rule_update', entity:'CutoffRule', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='delete'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      await prisma.cutoffRule.update({ where:{ id }, data:{ active:false } });
      await prisma.auditLog.create({ data:{ action:'cutoff_rule_soft_delete', entity:'CutoffRule', entityId: id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  }catch(e){
    return NextResponse.json({ error:'cutoff_rule_op_failed'},{ status:500 });
  }
}
