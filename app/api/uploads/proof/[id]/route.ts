import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-user';

// GET /api/uploads/proof/:id - protected download
export async function GET(req:Request, ctx:{ params:{ id:string } }){
  try {
    const { id } = ctx.params; // filename
  const user = await getSessionUser(req);
    if(!user) return NextResponse.json({ error:'auth_required'},{ status:401 });
    // Find payment intent referencing this file
    const intent = await prisma.paymentIntent.findFirst({ where:{ proofUrl: { endsWith:`/${id}` } }, include:{ order:true } });
    if(!intent) return NextResponse.json({ error:'not_found'},{ status:404 });
    const ownerOk = intent.order?.userId && intent.order.userId === user.id;
    const adminOk = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    if(!ownerOk && !adminOk) return NextResponse.json({ error:'forbidden'},{ status:403 });
    const storagePath = path.join(process.cwd(),'storage','proofs', id);
    try { await fs.access(storagePath); } catch { return NextResponse.json({ error:'file_missing'},{ status:404 }); }
    const data = await fs.readFile(storagePath);
    await prisma.auditLog.create({ data:{ action:'proof_download', entity:'PaymentIntent', entityId:intent.id, actorId:user.id, actorRole:user.role, meta:{ bytes: data.length, filename:id } } });
  return new Response(new Uint8Array(data), { status:200, headers:{ 'Content-Type':'application/octet-stream', 'Content-Disposition':`attachment; filename="${id}"` }});
  } catch(e){
    console.error(e);
    return NextResponse.json({ error:'download_failed'},{ status:500 });
  }
}
