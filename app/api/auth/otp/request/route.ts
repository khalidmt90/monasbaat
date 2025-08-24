import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loadFeatureFlags } from '@/lib/featureFlags';

export async function POST(req:Request){
  const flags = await loadFeatureFlags();
  if(!flags.auth?.otp?.enabled) return NextResponse.json({ error:'otp_disabled'},{ status:400 });
  const { phone } = await req.json();
  if(!phone) return NextResponse.json({ error:'phone_required'},{ status:400 });
  const code = String(Math.floor(100000 + Math.random()*900000));
  const expiresAt = new Date(Date.now()+ 5*60*1000);
  await prisma.otpRequest.create({ data:{ phone, code, expiresAt } });
  // In production send SMS here.
  return NextResponse.json({ ok:true, testCode: process.env.NODE_ENV!=='production'? code: undefined });
}
