import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

function validate(code?:string, nameAr?:string, nameEn?:string){ if(!code||!nameAr||!nameEn) return false; if(code.trim().length===0||nameAr.trim().length===0||nameEn.trim().length===0) return false; if(code.length>32||nameAr.length>100||nameEn.length>100) return false; return true; }

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try {
    const { action, id, animalId, code, nameAr, nameEn, active } = await req.json();
    if(action==='create'){
      if(!animalId||!validate(code,nameAr,nameEn)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.age.create({ data:{ animalId, code:code.trim().toUpperCase(), nameAr:nameAr.trim(), nameEn:nameEn!.trim() } });
      await prisma.auditLog.create({ data:{ action:'age_create', entity:'Age', entityId: row.id, meta:{ animalId } } });
      return NextResponse.json(row);
    }
    if(action==='update'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      if(code||nameAr||nameEn){ if(!validate(code||'X', nameAr||'X', nameEn||'X')) return NextResponse.json({ error:'validation'},{ status:400 }); }
      const row = await prisma.age.update({ where:{ id }, data:{ code:code?.trim().toUpperCase(), nameAr:nameAr?.trim(), nameEn:nameEn?.trim(), active } });
      await prisma.auditLog.create({ data:{ action:'age_update', entity:'Age', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='delete'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      const mappingCount = await prisma.ageWeightMapping.count({ where:{ ageId:id } });
      if(mappingCount>0) return NextResponse.json({ error:'in_use'},{ status:409 });
      const row = await prisma.age.update({ where:{ id }, data:{ active:false } });
      await prisma.auditLog.create({ data:{ action:'age_soft_delete', entity:'Age', entityId: row.id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  } catch(e){
    return NextResponse.json({ error:'age_op_failed'},{ status:500 });
  }
}