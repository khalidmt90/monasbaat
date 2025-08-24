import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

// POST { rows:[{ id?, animalId?, animalType, ageId, sizeBandId, estimatedWeightKg, basePriceModifier }] action:'upsert'|'delete'
export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try {
    const body = await req.json();
    const { action } = body;
  if(action==='upsert'){
      const rows = Array.isArray(body.rows)? body.rows:[];
      const results:any[]=[];
      for(const r of rows){
    if(!r.ageId || (!r.animalType && !r.animalId)) continue;
    if(typeof r.estimatedWeightKg !== 'number' || r.estimatedWeightKg<=0) continue;
        const data:any = { animalType: r.animalType, animalId: r.animalId, ageId: r.ageId, sizeBandId: r.sizeBandId, estimatedWeightKg: r.estimatedWeightKg, basePriceModifier: r.basePriceModifier ?? 0 };
        let saved;
        if(r.id){
          saved = await prisma.ageWeightMapping.update({ where:{ id: r.id }, data });
          await prisma.auditLog.create({ data:{ action:'mapping_update', entity:'AgeWeightMapping', entityId: saved.id } });
        } else {
          // Try find existing by composite
          const existing = r.animalId ? await prisma.ageWeightMapping.findFirst({ where:{ animalId:r.animalId, ageId:r.ageId } }) : await prisma.ageWeightMapping.findFirst({ where:{ animalType:r.animalType, ageId:r.ageId } });
          if(existing){
            saved = await prisma.ageWeightMapping.update({ where:{ id: existing.id }, data });
            await prisma.auditLog.create({ data:{ action:'mapping_update', entity:'AgeWeightMapping', entityId: saved.id } });
          } else {
            saved = await prisma.ageWeightMapping.create({ data });
            await prisma.auditLog.create({ data:{ action:'mapping_create', entity:'AgeWeightMapping', entityId: saved.id } });
          }
        }
        results.push(saved);
      }
      return NextResponse.json({ rows: results });
    }
    if(action==='delete'){
      const { id } = body; if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      await prisma.ageWeightMapping.delete({ where:{ id } });
      await prisma.auditLog.create({ data:{ action:'mapping_delete', entity:'AgeWeightMapping', entityId: id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  } catch(e){
    return NextResponse.json({ error:'mapping_op_failed'},{ status:500 });
  }
}