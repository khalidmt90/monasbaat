import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

function validate(code?:string, nameAr?:string, nameEn?:string){
  if(!code||!nameAr||!nameEn) return false;
  if(code.trim().length===0||nameAr.trim().length===0||nameEn.trim().length===0) return false;
  if(code.trim().length>32||nameAr.trim().length>100||nameEn.trim().length>100) return false;
  return true;
}

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try {
    const { action, id, code, nameAr, nameEn, active } = await req.json();
    if(action==='create'){
      if(!validate(code,nameAr,nameEn)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.animal.create({ data:{ code:code.trim().toUpperCase(), nameAr:nameAr.trim(), nameEn:nameEn.trim() } });
      await prisma.auditLog.create({ data:{ action:'animal_create', entity:'Animal', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='update'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      if(code||nameAr||nameEn){ if(!validate(code||'X', nameAr||'X', nameEn||'X')) return NextResponse.json({ error:'validation'},{ status:400 }); }
      const row = await prisma.animal.update({ where:{ id }, data:{ code: code?.trim().toUpperCase(), nameAr: nameAr?.trim(), nameEn: nameEn?.trim(), active } });
      await prisma.auditLog.create({ data:{ action:'animal_update', entity:'Animal', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='delete'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      const animal = await prisma.animal.findUnique({ where:{ id }, select:{ code:true } });
      if(!animal) return NextResponse.json({ error:'not_found'},{ status:404 });
      const mappingCount = await prisma.ageWeightMapping.count({ where:{ OR:[ { animalId:id }, { animalType: animal.code } ] } });
      if(mappingCount>0) return NextResponse.json({ error:'in_use'},{ status:409 });
      const childCounts = await Promise.all([
        prisma.age.count({ where:{ animalId:id, active:true }}),
        prisma.breed.count({ where:{ animalId:id, active:true }}),
        prisma.sizeBand.count({ where:{ animalId:id, active:true }}),
      ]);
      if(childCounts.some(c=>c>0)) return NextResponse.json({ error:'has_children'},{ status:409 });
      const row = await prisma.animal.update({ where:{ id }, data:{ active:false } });
      await prisma.auditLog.create({ data:{ action:'animal_soft_delete', entity:'Animal', entityId: row.id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  } catch(e:any){
    console.error('animal_op_failed', e);
    return NextResponse.json({ error:'animal_op_failed', detail: e?.message },{ status:500 });
  }
}