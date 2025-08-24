import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
  const hall = await prisma.hall.findFirst({ where:{ id: params.id, isActive:true, isVerified:true }, select:{ id:true }});
  if(!hall) return NextResponse.json([], { status:200 });
  const slots = await prisma.hallSlot.findMany({
      where: { hallId: hall.id },
      select: { id: true, date: true, startTime: true, endTime: true, status: true, priceOverride: true, capacityLimit: true },
      orderBy: { date: "asc" },
      take: 120,
    });
    return NextResponse.json(slots);
  } catch (e) {
    return NextResponse.json({ error: "slots_unavailable" }, { status: 503 });
  }
}
