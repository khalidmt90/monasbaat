import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Prevent Next from attempting to prerender this route at build time
export const dynamic = 'force-dynamic';

export async function GET(){
  const halls = await prisma.hall.findMany({ where:{ isActive:true, isVerified:true }, select:{ id:true, slug:true, name:true, city:true, basePrice:true, images:true, amenities:true, menCapacity:true, womenCapacity:true } });
  return NextResponse.json(halls);
}