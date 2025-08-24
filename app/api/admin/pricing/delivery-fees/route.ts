import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

function validate(data:any){
  if(!data.cityId||!data.deliveryMethod) return false;
  if(typeof data.baseFeeMinor!=='number' || data.baseFeeMinor<0) return false;
  if(typeof data.minOrderMinor!=='number' || data.minOrderMinor<0) return false;
  return true;
}

export async function POST(req:Request){
  const guard = await ensureSuperAdmin(req) as any; if(guard?.error) return NextResponse.json({ error:'forbidden'},{ status:403 });
  try{
    const { action, id, ...data } = await req.json();
    if(action==='create'){
      if(!validate(data)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.pricingDeliveryFee.create({ data });
      await prisma.auditLog.create({ data:{ action:'pricing_delivery_fee_create', entity:'PricingDeliveryFee', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='update'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      if(!validate(data)) return NextResponse.json({ error:'validation'},{ status:400 });
      const row = await prisma.pricingDeliveryFee.update({ where:{ id }, data });
      await prisma.auditLog.create({ data:{ action:'pricing_delivery_fee_update', entity:'PricingDeliveryFee', entityId: row.id } });
      return NextResponse.json(row);
    }
    if(action==='delete'){
      if(!id) return NextResponse.json({ error:'missing_id'},{ status:400 });
      await prisma.pricingDeliveryFee.update({ where:{ id }, data:{ isActive:false } });
      await prisma.auditLog.create({ data:{ action:'pricing_delivery_fee_soft_delete', entity:'PricingDeliveryFee', entityId: id } });
      return NextResponse.json({ ok:true });
    }
    return NextResponse.json({ error:'unknown_action'},{ status:400 });
  }catch(e){
    return NextResponse.json({ error:'pricing_delivery_fee_op_failed'},{ status:500 });
  }
}
