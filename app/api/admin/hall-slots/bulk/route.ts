import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';
import { timeToMin } from '@/lib/logistics';

/* Body: { action:'create|open|close|set', hallId, dates:[ISO], startTime, endTime, priceMinor?, capacity? } */
export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try{
    const { action, hallId, dates, startTime, endTime, priceMinor, capacity } = await req.json();
    if(!hallId || !Array.isArray(dates) || dates.length===0) return NextResponse.json({ error:'validation'},{ status:400 });
    if(!startTime||!endTime) return NextResponse.json({ error:'validation'},{ status:400 });
    const startMin = timeToMin(startTime); const endMin = timeToMin(endTime);
    if(startMin>=endMin) return NextResponse.json({ error:'time_range'},{ status:400 });
    const hall = await prisma.hall.findUnique({ where:{ id: hallId } }); if(!hall) return NextResponse.json({ error:'hall_not_found'},{ status:404 });
    let affected=0;
    if(action==='create'){
      for(const d of dates){
        const date = new Date(d);
        const existing = await prisma.hallSlot.findFirst({ where:{ hallId, date, startTime, endTime } });
        if(existing) continue;
        await prisma.hallSlot.create({ data:{ hallId, date, startTime, endTime, startMin, endMin, priceMinor: priceMinor??null, capacity: capacity??null, status:'open' } });
        affected++;
      }
      await prisma.auditLog.create({ data:{ action:'hall_slot_bulk_create', entity:'Hall', entityId: hallId, meta:{ count:affected } } });
      return NextResponse.json({ created: affected });
    }
    if(action==='open' || action==='close'){
      const targetStatus = action==='open'?'open':'closed';
      if(action==='open'){
        // Prevent reopening any final slots in this range
        const finals = await prisma.hallSlot.findMany({ where:{ hallId, startTime, endTime, status:'final', date: { in: dates.map((d:string)=> new Date(d)) } }, select:{ id:true, date:true } });
        if(finals.length){
          const finalIds = finals.map((f:{id:string})=> f.id);
          await prisma.auditLog.create({ data:{ action:'hall_slot_bulk_open_blocked_final', entity:'Hall', entityId: hallId, meta:{ finals: finalIds } } });
          return NextResponse.json({ error:'cannot_reopen_final', finals: finalIds }, { status:409 });
        }
      }
      for(const d of dates){
        const date = new Date(d);
        affected += await prisma.hallSlot.updateMany({ where:{ hallId, date, startTime, endTime, status: action==='open'? 'closed':'open' }, data:{ status: targetStatus } }).then((r:any)=>r.count);
      }
      await prisma.auditLog.create({ data:{ action:`hall_slot_bulk_${action}`, entity:'Hall', entityId: hallId, meta:{ count:affected } } });
      return NextResponse.json({ updated: affected });
    }
    if(action==='set'){
      for(const d of dates){
        const date = new Date(d);
  affected += await prisma.hallSlot.updateMany({ where:{ hallId, date, startTime, endTime }, data:{ priceMinor, capacity } }).then((r:any)=>r.count);
      }
      await prisma.auditLog.create({ data:{ action:'hall_slot_bulk_set', entity:'Hall', entityId: hallId, meta:{ count:affected } } });
      return NextResponse.json({ updated: affected });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  }catch(e){
    return NextResponse.json({ error:'hall_slot_bulk_failed'},{ status:500 });
  }
}