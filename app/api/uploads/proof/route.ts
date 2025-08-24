import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { ensureOrderOwner } from '@/lib/api-user';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

// POST multipart/form-data: fields: order_id, file
export async function POST(req: Request){
  try {
    const form = await req.formData();
    const orderId = form.get('order_id');
    if(typeof orderId !== 'string') return NextResponse.json({ error:'missing_order_id'},{ status:400 });
  const ownership = await ensureOrderOwner(orderId as string, req);
    if((ownership as any)?.json) return ownership as any;
    const file = form.get('file');
    if(!(file instanceof File)) return NextResponse.json({ error:'missing_file'},{ status:400 });
    const buf = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(),'storage','proofs');
    await fs.mkdir(uploadsDir,{ recursive:true });
    const ext = (file.name.split('.').pop()||'dat').slice(0,8);
    const filename = `${orderId}-${Date.now()}.${ext}`;
    const full = path.join(uploadsDir, filename);
  await fs.writeFile(full, new Uint8Array(buf));
  const apiUrl = `/api/uploads/proof/${filename}`;
    // Persist on first payment intent
    const intent = await prisma.paymentIntent.findFirst({ where:{ orderId }, orderBy:{ createdAt:'asc' } });
    if(intent){
      await prisma.paymentIntent.update({ where:{ id:intent.id }, data:{ proofUrl: apiUrl, proofSubmittedAt: new Date() } });
      await prisma.auditLog.create({ data:{ action:'proof_uploaded', entity:'PaymentIntent', entityId:intent.id, meta:{ orderId, filename, size: buf.length } } });
    }
    return NextResponse.json({ url: apiUrl });
  } catch(e){
    console.error(e);
    return NextResponse.json({ error:'upload_failed'},{ status:500 });
  }
}
