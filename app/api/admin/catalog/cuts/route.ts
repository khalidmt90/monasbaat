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
    const { action, id, code, nameAr, nameEn, priceModifier, active } = await req.json();
    if(action==='create'){
      if(!validate(code,nameAr,nameEn)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.cutPreset.create({ data:{ code:code!.trim().toUpperCase(), nameAr:nameAr!.trim(), nameEn:nameEn!.trim(), priceModifier: priceModifier??0 } });
      await prisma.auditLog.create({ data:{ action:'cut_create', entity:'CutPreset', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='update'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      if(code||nameAr||nameEn){ if(!validate(code||'X', nameAr||'X', nameEn||'X')) return NextResponse.json({ error:'validation'},{ status:400 }); }
      const row = await prisma.cutPreset.update({ where:{ id }, data:{ code:code?.trim().toUpperCase(), nameAr:nameAr?.trim(), nameEn:nameEn?.trim(), priceModifier, active } });
      await prisma.auditLog.create({ data:{ action:'cut_update', entity:'CutPreset', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='delete'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      await prisma.cutPreset.update({ where:{ id }, data:{ active:false } });
      await prisma.auditLog.create({ data:{ action:'cut_soft_delete', entity:'CutPreset', entityId: id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  } catch(e:any){
    console.error('cut_op_failed', e);
    return NextResponse.json({ error:'cut_op_failed', detail:e?.message },{ status:500 });
  }
}