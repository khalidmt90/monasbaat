import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

// Body: { slotId, priceMinor?, capacity?, status? }
export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try{
    const { slotId, priceMinor, capacity, status } = await req.json();
    if(!slotId) return NextResponse.json({ error:'missing_slot_id'},{ status:400 });
    const slot = await prisma.hallSlot.findUnique({ where:{ id: slotId }, select:{ status:true } });
    if(!slot) return NextResponse.json({ error:'not_found'},{ status:404 });
    if(status==='open' && (slot.status==='final')) return NextResponse.json({ error:'cannot_reopen_final'},{ status:409 });
    const row = await prisma.hallSlot.update({ where:{ id: slotId }, data:{ priceMinor, capacity, status } });
    await prisma.auditLog.create({ data:{ action:'hall_slot_override', entity:'HallSlot', entityId: slotId, meta:{ priceMinor, capacity, status } } });
    return NextResponse.json(row);
  }catch(e){
    return NextResponse.json({ error:'hall_slot_override_failed'},{ status:500 });
  }
}