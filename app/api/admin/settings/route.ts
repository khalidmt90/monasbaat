import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

// GET returns merged settings
export async function GET(req:Request){
  const guard = await ensureSuperAdmin(req) as any;
  if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  const keys = [
    'bank.transfer.settings',
    'feature_flags',
    'min_app_version',
    'labels_ar',
    'labels_en'
  ];
  const rows = await prisma.globalConfig.findMany({ where:{ key:{ in: keys }}});
  const map:Record<string,any>={}; rows.forEach((r:{ key:string; value:any })=> { map[r.key]=r.value; });
  return NextResponse.json(map);
}

// POST { key, value } upsert
export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any;
  if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try {
    const body = await req.json();
    const { key, value } = body;
    if(!key) return NextResponse.json({ error:'missing_key'},{ status:400 });
    const row = await prisma.globalConfig.upsert({ where:{ key }, update:{ value }, create:{ key, value } });
    await prisma.auditLog.create({ data:{ action:'config_upsert', entity:'GlobalConfig', entityId: key, meta:{ key } } });
    return NextResponse.json({ ok:true, key, value: row.value });
  } catch(e){
    return NextResponse.json({ error:'settings_update_failed'},{ status:500 });
  }
}