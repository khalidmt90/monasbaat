import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

function validate(cityId?:string, labelAr?:string, startMin?:number, endMin?:number){
  if(!cityId||!labelAr||startMin==null||endMin==null) return false;
  if(!labelAr.trim()) return false;
  if(startMin<0||endMin>1440||startMin>=endMin) return false;
  return true;
}

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try{
    const { action, id, cityId, labelAr, labelEn, startMin, endMin, active } = await req.json();
    if(action==='create'){
      if(!validate(cityId,labelAr,startMin,endMin)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.deliveryWindow.create({ data:{ cityId, labelAr: labelAr.trim(), labelEn: labelEn?.trim(), startMin, endMin } });
      await prisma.auditLog.create({ data:{ action:'delivery_window_create', entity:'DeliveryWindow', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='update'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      if(startMin!=null||endMin!=null){ if(startMin==null||endMin==null||startMin<0||endMin>1440||startMin>=endMin) return NextResponse.json({ error:'validation'},{ status:400 }); }
      const row = await prisma.deliveryWindow.update({ where:{ id }, data:{ labelAr: labelAr?.trim(), labelEn: labelEn?.trim(), startMin, endMin, active } });
      await prisma.auditLog.create({ data:{ action:'delivery_window_update', entity:'DeliveryWindow', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='delete'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      await prisma.deliveryWindow.update({ where:{ id }, data:{ active:false } });
      await prisma.auditLog.create({ data:{ action:'delivery_window_soft_delete', entity:'DeliveryWindow', entityId: id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  }catch(e){
    return NextResponse.json({ error:'delivery_window_op_failed'},{ status:500 });
  }
}
