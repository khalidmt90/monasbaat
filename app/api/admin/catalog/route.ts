import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

export async function GET(req:Request){
  const guard = await ensureSuperAdmin(req) as any;
  if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  const [animals, breeds, ages, sizeBands, mappings, cuts, packaging, cooking, sides] = await Promise.all([
    prisma.animal.findMany(),
    prisma.breed.findMany(),
    prisma.age.findMany(),
    prisma.sizeBand.findMany(),
    prisma.ageWeightMapping.findMany(),
    prisma.cutPreset.findMany(),
    prisma.packagingOption.findMany(),
    prisma.cookingOption.findMany(),
    prisma.sideOption.findMany()
  ]);
  return NextResponse.json({ animals, breeds, ages, sizeBands, ageWeightMapping: mappings, cuts, packaging, cooking, sides });
}