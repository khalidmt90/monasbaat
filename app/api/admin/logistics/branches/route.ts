import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

function validate(cityId?:string, nameAr?:string){ if(!cityId||!nameAr) return false; if(!nameAr.trim()) return false; return true; }

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try{
    const { action, id, cityId, code, nameAr, nameEn, address, phone, active } = await req.json();
    if(action==='create'){
      if(!validate(cityId,nameAr)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.branch.create({ data:{ cityId, code: (code||nameAr).trim().toUpperCase(), nameAr: nameAr.trim(), nameEn: nameEn?.trim(), address: address?.trim(), phone: phone?.trim() } });
      await prisma.auditLog.create({ data:{ action:'branch_create', entity:'Branch', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='update'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      const row = await prisma.branch.update({ where:{ id }, data:{ code: code?.trim().toUpperCase(), nameAr: nameAr?.trim(), nameEn: nameEn?.trim(), address: address?.trim(), phone: phone?.trim(), active } });
      await prisma.auditLog.create({ data:{ action:'branch_update', entity:'Branch', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='delete'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      await prisma.branch.update({ where:{ id }, data:{ active:false } });
      await prisma.auditLog.create({ data:{ action:'branch_soft_delete', entity:'Branch', entityId: id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  }catch(e){
    return NextResponse.json({ error:'branch_op_failed'},{ status:500 });
  }
}
