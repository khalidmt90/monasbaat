import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
import { getCutoffContext, passesCutoffs, resolveCapacity } from '@/lib/logistics';

// Input: { hall_id, date_range:{ start: ISO, end: ISO } }
export async function POST(req:Request){
  try {
    const body = await req.json();
    const hallId = body.hall_id;
    const range = body.date_range||{};
    if(!hallId) return NextResponse.json({ error:'missing_hall_id'},{ status:400 });
    if(!range.start || !range.end) return NextResponse.json({ error:'missing_range'},{ status:400 });
    const start = new Date(range.start);
    const end = new Date(range.end);
  const hall = await prisma.hall.findFirst({ where:{ id: hallId, isActive:true, isVerified:true }, select:{ id:true, cityId:true }});
    if(!hall) return NextResponse.json({ slots:[] });
  const slots = await prisma.hallSlot.findMany({ where:{ hallId: hall.id, date:{ gte:start, lte:end }, status:'open' }, orderBy:{ date:'asc' }});
  const cutoffCtx = hall.cityId ? await getCutoffContext(hall.cityId) : {};
  const enriched = [] as any[];
  for(const s of slots){
    const startMin = s.startMin ?? (parseInt(s.startTime.split(':')[0])*60 + parseInt(s.startTime.split(':')[1]||'0'));
    const capacityBaseline = hall.cityId ? await resolveCapacity(hall.cityId, s.date.getDay(), startMin) : undefined;
    if(!passesCutoffs(s.date, startMin, cutoffCtx)) continue;
    const capacity = s.capacity ?? capacityBaseline ?? s.capacityLimit ?? null;
    if(capacity === 0) continue;
    enriched.push({ ...s, capacity });
  }
    return NextResponse.json({ slots: enriched });
  } catch(e){
    console.error(e);
    return NextResponse.json({ error:'availability_failed'},{ status:500 });
  }
}
