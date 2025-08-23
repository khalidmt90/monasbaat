import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAdminApi } from '@/lib/api-admin';

export async function GET(){
  const guard = await ensureAdminApi();
  if((guard as any)?.error) return guard as any;
  const rows: any[] = await prisma.$queryRawUnsafe("SELECT id,key,value,createdAt,updatedAt FROM FeatureFlag ORDER BY key ASC");
  return NextResponse.json(rows.map(r=>({id:r.id,key:r.key,value:r.value})));
}

export async function POST(req:Request){
  const guard = await ensureAdminApi();
  if((guard as any)?.error) return guard as any;
  const body = await req.json();
  if(!Array.isArray(body.flags)) return NextResponse.json({error:"flags array required"},{status:400});
  for(const f of body.flags){
    if(typeof f.key !== 'string') continue;
    // Upsert via raw queries (SQLite)
    await prisma.$executeRawUnsafe(
      "INSERT INTO FeatureFlag (id,key,value,createdAt,updatedAt) VALUES (?,?,?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updatedAt=excluded.updatedAt",
      crypto.randomUUID(),
      f.key,
      JSON.stringify(f.value ?? {}),
      new Date().toISOString(),
      new Date().toISOString()
    );
  }
  return NextResponse.json({ok:true});
}
