import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

function validate(cityId?:string, dayOfWeek?:number, startMin?:number, endMin?:number, capacity?:number){
  if(!cityId||dayOfWeek==null||startMin==null||endMin==null||capacity==null) return false;
  if(dayOfWeek<0||dayOfWeek>6) return false;
  if(startMin<0||endMin>1440||startMin>=endMin) return false;
  if(capacity<0) return false;
  return true;
}

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try{
    const { action, id, cityId, dayOfWeek, startMin, endMin, capacity, active } = await req.json();
    if(action==='create'){
      if(!validate(cityId,dayOfWeek,startMin,endMin,capacity)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.slotCapacity.create({ data:{ cityId, dayOfWeek, startMin, endMin, capacity } });
      await prisma.auditLog.create({ data:{ action:'slot_capacity_create', entity:'SlotCapacity', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='update'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      if((startMin!=null||endMin!=null) && (startMin==null||endMin==null||startMin<0||endMin>1440||startMin>=endMin)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.slotCapacity.update({ where:{ id }, data:{ dayOfWeek, startMin, endMin, capacity, active } });
      await prisma.auditLog.create({ data:{ action:'slot_capacity_update', entity:'SlotCapacity', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='delete'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      await prisma.slotCapacity.update({ where:{ id }, data:{ active:false } });
      await prisma.auditLog.create({ data:{ action:'slot_capacity_soft_delete', entity:'SlotCapacity', entityId: id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  }catch(e){
    return NextResponse.json({ error:'slot_capacity_op_failed'},{ status:500 });
  }
}
