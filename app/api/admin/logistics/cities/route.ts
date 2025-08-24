import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

function validate(code?:string, nameAr?:string){
  if(!code||!nameAr) return false; if(!code.trim()||!nameAr.trim()) return false; if(code.length>16||nameAr.length>100) return false; return true;
}

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try{
    const { action, id, code, nameAr, nameEn, active } = await req.json();
    if(action==='create'){
      if(!validate(code,nameAr)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.city.create({ data:{ code: code.trim().toUpperCase(), nameAr: nameAr.trim(), nameEn: nameEn?.trim() } });
      await prisma.auditLog.create({ data:{ action:'city_create', entity:'City', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='update'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      const row = await prisma.city.update({ where:{ id }, data:{ code: code?.trim().toUpperCase(), nameAr: nameAr?.trim(), nameEn: nameEn?.trim(), active } });
      await prisma.auditLog.create({ data:{ action:'city_update', entity:'City', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='delete'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      const branchCount = await prisma.branch.count({ where:{ cityId:id, active:true } });
      const hallCount = await prisma.hall.count({ where:{ city: (await prisma.city.findUnique({ where:{ id }, select:{ nameAr:true }}))?.nameAr || '' } }); // placeholder; proper FK not yet present
      if(branchCount>0||hallCount>0) return NextResponse.json({ error:'in_use'},{ status:409 });
      await prisma.city.update({ where:{ id }, data:{ active:false } });
      await prisma.auditLog.create({ data:{ action:'city_soft_delete', entity:'City', entityId: id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  }catch(e){
    return NextResponse.json({ error:'city_op_failed'},{ status:500 });
  }
}
