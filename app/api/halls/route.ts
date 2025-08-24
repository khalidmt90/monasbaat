import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(){
  const halls = await prisma.hall.findMany({ where:{ isActive:true, isVerified:true }, select:{ id:true, slug:true, name:true, city:true, basePrice:true, images:true, amenities:true, menCapacity:true, womenCapacity:true } });
  return NextResponse.json(halls);
}