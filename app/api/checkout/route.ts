import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Expected payload: { items: [{type:"hall"|"service", ...}], user: { phone?:string, email?:string, name?:string } }
export async function POST(req: Request){
  try {
    const body = await req.json();
    const items = Array.isArray(body.items)? body.items: [];
    if(!items.length) return NextResponse.json({ error:"empty_cart"},{ status:400 });
    // Basic VAT = 15% for all lines (placeholder). Each item price is pre-tax.
    const VAT_RATE = 0.15;
    let subtotal=0, vatTotal=0, grand=0;
    const orderItemsData:any[] = [];
    for(const it of items){
      const qty = it.qty || 1;
      const price = it.price * qty;
      const vat = Math.round(price * VAT_RATE);
      const total = price + vat;
      subtotal += price; vatTotal += vat; grand += total;
      orderItemsData.push({
        type: it.type === 'hall'? 'hall':'dhabaeh',
        refId: null,
        title: it.title?.slice(0,120) || it.type,
        meta: it.meta?.slice(0,240) || null,
        qty,
        price: price,
        vat,
        total,
        payload: { raw: it }
      });
    }
    const taxLines = [{ code:'VAT15', rate:15, amount: vatTotal }];
    const order = await prisma.order.create({ data:{ status:'pending', totalsJson:{ subtotal, vat: vatTotal, total: grand }, taxLines, items:{ create: orderItemsData } }, include:{ items:true }});
    return NextResponse.json({ order });
  } catch (e){
    console.error(e);
    return NextResponse.json({ error:"checkout_failed"},{ status:500 });
  }
}
