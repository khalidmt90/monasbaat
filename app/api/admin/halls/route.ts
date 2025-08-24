import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

function validateBase(name?:string, cityId?:string){ return !!(name && name.trim() && cityId); }

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try{
    const body = await req.json();
    const { action, id } = body;
    if(action==='create'){
      const { slug, name, cityId, basePrice, amenities, images } = body;
      if(!validateBase(name, cityId)) return NextResponse.json({ error:'validation'},{ status:400 });
      const city = await prisma.city.findUnique({ where:{ id: cityId } });
      if(!city) return NextResponse.json({ error:'city_not_found'},{ status:404 });
      const row = await prisma.hall.create({ data:{ slug: slug?.trim() || `h-${Date.now()}`, name: name.trim(), city: city.nameAr, cityId, basePrice: basePrice??0, sessions: body.sessions||[], amenities: amenities||[], images: images||[], isVerified: !!body.isVerified } });
      await prisma.auditLog.create({ data:{ action:'hall_create', entity:'Hall', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='update'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      const data:any = {};
      for(const k of ['name','basePrice','sessions','amenities','images','isVerified']) if(body[k]!==undefined) data[k==='basePrice'?'basePrice':k] = body[k];
      if(body.cityId){
        const city = await prisma.city.findUnique({ where:{ id: body.cityId } });
        if(!city) return NextResponse.json({ error:'city_not_found'},{ status:404 });
        data.cityId = body.cityId; data.city = city.nameAr;
      }
      const row = await prisma.hall.update({ where:{ id }, data });
      await prisma.auditLog.create({ data:{ action:'hall_update', entity:'Hall', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='delete'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      await prisma.hall.update({ where:{ id }, data:{ isActive:false } });
      await prisma.auditLog.create({ data:{ action:'hall_soft_delete', entity:'Hall', entityId: id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  }catch(e){
    return NextResponse.json({ error:'hall_op_failed'},{ status:500 });
  }
}