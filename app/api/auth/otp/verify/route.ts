import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loadFeatureFlags } from '@/lib/featureFlags';

export async function POST(req:Request){
  const flags = await loadFeatureFlags();
  if(!flags.auth?.otp?.enabled) return NextResponse.json({ error:'otp_disabled'},{ status:400 });
  const { phone, code } = await req.json();
  if(!phone || !code) return NextResponse.json({ error:'invalid'},{ status:400 });
  const record = await prisma.otpRequest.findFirst({ where:{ phone, code, consumedAt:null, expiresAt:{ gt: new Date() }}, orderBy:{ createdAt:'desc' }} as any);
  if(!record) return NextResponse.json({ error:'invalid_code'},{ status:400 });
  await prisma.otpRequest.update({ where:{ id: record.id }, data:{ consumedAt: new Date() }});
  // Mark phone verified for user if exists
  const user = await prisma.user.findFirst({ where:{ phone }});
  if(user && !user.phoneVerified){ await prisma.user.update({ where:{ id:user.id }, data:{ phoneVerified:true }}); }
  return NextResponse.json({ ok:true });
}