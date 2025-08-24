import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

function validate(code?:string,labelAr?:string,labelEn?:string){ if(!code||!labelAr||!labelEn) return false; if(code.trim().length===0||labelAr.trim().length===0||labelEn.trim().length===0) return false; if(code.length>32||labelAr.length>100||labelEn.length>100) return false; return true; }

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try {
    const { action, id, animalId, code, labelAr, labelEn, minWeight, maxWeight, active } = await req.json();
    if(action==='create'){
      if(!animalId||!validate(code,labelAr,labelEn)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.sizeBand.create({ data:{ animalId, code:code.trim().toUpperCase(), labelAr:labelAr.trim(), labelEn:labelEn!.trim(), minWeight, maxWeight } });
      await prisma.auditLog.create({ data:{ action:'sizeband_create', entity:'SizeBand', entityId: row.id, meta:{ animalId } } });
      return NextResponse.json(row);
    }
    if(action==='update'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      if(code||labelAr||labelEn){ if(!validate(code||'X',labelAr||'X',labelEn||'X')) return NextResponse.json({ error:'validation'},{ status:400 }); }
      const row = await prisma.sizeBand.update({ where:{ id }, data:{ code:code?.trim().toUpperCase(), labelAr:labelAr?.trim(), labelEn:labelEn?.trim(), minWeight, maxWeight, active } });
      await prisma.auditLog.create({ data:{ action:'sizeband_update', entity:'SizeBand', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='delete'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      const mappingCount = await prisma.ageWeightMapping.count({ where:{ sizeBandId:id } });
      if(mappingCount>0) return NextResponse.json({ error:'in_use'},{ status:409 });
      const row = await prisma.sizeBand.update({ where:{ id }, data:{ active:false } });
      await prisma.auditLog.create({ data:{ action:'sizeband_soft_delete', entity:'SizeBand', entityId: row.id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  } catch(e){
    return NextResponse.json({ error:'sizeband_op_failed'},{ status:500 });
  }
}