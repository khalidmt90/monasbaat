import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-user';
import type { Prisma } from '@prisma/client';
import { loadCatalog } from '@/lib/catalog';
import { priceDhabaeh } from '@/lib/pricing';
import { nextCounter, formatSeq } from '@/lib/counters';

type BankConfigValue = { beneficiary?:string; iban?:string; bankName?:string; instructions?:string; deadlineHours?:number };

// POST /api/checkout/create-order
// Input: { customer:{ name, phone, email, nationalId? }, context:{ mode, cityId?, deliveryMethod }, lineItems:[], totals, agreements:{ termsAccepted, locale } }
export async function POST(req:Request){
  try {
    const body = await req.json();
  if(!body.agreements?.termsAccepted){ console.error('create-order validation fail: terms_not_accepted'); return NextResponse.json({ error:'terms_not_accepted'},{ status:400 }); }
    if(!body.agreements?.termsAccepted) return NextResponse.json({ error:'terms_not_accepted'},{ status:400 });
    const customer = body.customer||{};
  if(!customer.name || !customer.phone || !customer.email){ console.error('create-order validation fail: missing_customer_fields', customer); return NextResponse.json({ error:'missing_customer_fields'},{ status:400 }); }
    if(!customer.name || !customer.phone || !customer.email) return NextResponse.json({ error:'missing_customer_fields'},{ status:400 });
    const context = body.context||{};
    const lineItems = Array.isArray(body.lineItems)? body.lineItems: [];
  if(!lineItems.length){ console.error('create-order validation fail: empty_cart'); return NextResponse.json({ error:'empty_cart'},{ status:400 }); }
    if(!lineItems.length) return NextResponse.json({ error:'empty_cart'},{ status:400 });

  // Determine if we need catalog pricing (only for dhabaeh items)
  const needsCatalog = (body.lineItems||[]).some((li:any)=> li.kind==='dhabaeh');
  const catalog = needsCatalog ? await loadCatalog() : { vatPercent:15 } as any;
    const orderItems: { type:string; title:string; qty:number; price:number; vat:number; total:number; payload:any }[] = [];
    const hallSlotIds: string[] = [];
    let net=0, vat=0;
    for(const li of lineItems){
      if(li.kind==='dhabaeh'){
        const sel = { animalId: li.animalId, ageId: li.ageId, cutPresetId: li.cutPresetId, packagingId: li.packagingId, cookingId: li.cookingId, sideIds: li.sideIds, deliveryTarget: (context.deliveryMethod==='hall'?'HALL':'HOME') as 'HALL'|'HOME', cityId: context.cityId };
  const priced = priceDhabaeh(sel, catalog); // safe because catalog loaded when needed
        const qty = li.qty||1;
        const lineNet = priced.subtotal - priced.vat;
        net += lineNet * qty; vat += priced.vat * qty;
        orderItems.push({ type:'dhabaeh', title:'Dhabaeh', qty, price: lineNet, vat: priced.vat, total: priced.total, payload:{ sel, priced } });
      } else if(li.kind==='hall_slot' && li.slotId){
        hallSlotIds.push(li.slotId);
        // Price placeholder (0) – pricing can be extended later
        orderItems.push({ type:'hall_slot', title:'Hall Slot', qty:1, price:0, vat:0, total:0, payload:{ slotId: li.slotId }});
      }
    }
    const total = net + vat; // hall slot pricing currently zeroed

  // Generate order_ref (simple non-atomic placeholder; will be replaced by Counter in next step)
  // Minimal delegate typing (runtime delegates confirmed) to avoid any-casts
  interface OrderDelegate { count(): Promise<number>; create(args: Record<string, unknown>): Promise<Record<string, unknown>> }
  interface PaymentIntentDelegate { create(args: Record<string, unknown>): Promise<Record<string, unknown>> }
  const db = prisma as unknown as { order: OrderDelegate; paymentIntent: PaymentIntentDelegate };
    // Full transaction for: lock slots -> counters -> order + bookings + payment intent + audit logs
  const sessionUser = await getSessionUser(req);
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Lock hall slots (optimistic concurrency)
      const lockedSlots: any[] = [];
      for(const slotId of hallSlotIds){
        // Check if already locked
        const existingLock = await tx.slotLock.findUnique({ where:{ slotId } });
        if(existingLock) throw Object.assign(new Error('slot_conflict'), { code:'SLOT_CONFLICT' });
        const res = await tx.hallSlot.updateMany({ where:{ id: slotId, status:'open' }, data:{ status:'closed' } });
        if(res.count === 0) throw Object.assign(new Error('slot_conflict'), { code:'SLOT_CONFLICT' });
        const slot = await tx.hallSlot.findUnique({ where:{ id: slotId }, select:{ id:true, hallId:true, date:true, startTime:true, endTime:true } });
        if(!slot) throw Object.assign(new Error('slot_not_found'), { code:'SLOT_NOT_FOUND' });
        lockedSlots.push(slot);
      }

  const seq = await nextCounter('order_ref', tx);
      const orderRef = formatSeq('MB', seq, 5);
  const bankCfg = await tx.globalConfig.findUnique({ where:{ key:'bank.transfer.settings' }});
  const bankValue: BankConfigValue | undefined = bankCfg?.value as BankConfigValue | undefined;
  const deadlineHours = bankValue?.deadlineHours ?? 24;
      const expiresAt = new Date(Date.now()+ deadlineHours*3600*1000);

  const order = await tx.order.create({ data:{ status:'pending_payment', userId: sessionUser?.id, orderRef, context: context.mode, customerName: customer.name, customerEmail: customer.email, customerPhone: customer.phone, totalsJson:{ net, vat, total }, taxLines:[{ code:'VAT', rate: catalog.vatPercent, amount: vat }], expiresAt, items:{ create: orderItems } }, include:{ items:true } });

      // Create HallBooking + SlotLock records for locked slots
      for(const s of lockedSlots){
        await tx.hallBooking.create({ data:{ hallId: s.hallId, slotId: s.id, orderId: order.id, eventDate: s.date, startTime: s.startTime, endTime: s.endTime, status:'pending' } });
        await tx.slotLock.create({ data:{ slotId: s.id, orderId: order.id, expiresAt: order.expiresAt } });
      }

      await tx.paymentIntent.create({ data:{ orderId: order.id, type:'bank_transfer', status:'created', amountExpected: total } });

      // Audit logs: order_created + slot_lock entries
      await tx.auditLog.create({ data:{ action:'order_created', entity:'Order', entityId: order.id, meta:{ net, vat, total, orderRef } }});
      if(lockedSlots.length){
        for(const s of lockedSlots){
          await tx.auditLog.create({ data:{ action:'slot_lock', entity:'HallSlot', entityId: s.id, meta:{ orderId: order.id, orderRef } }});
        }
      }

  const bank = { beneficiary: bankValue?.beneficiary, iban: bankValue?.iban, bankName: bankValue?.bankName, instructions: bankValue?.instructions, reference: orderRef, deadline: expiresAt.toISOString() };

      return { order, orderRef, bank, expiresAt };
    });

    return NextResponse.json({ order_id: result.order.id, order_ref: result.orderRef, amount_due: total, currency:'SAR', bankInstructions: result.bank });
  } catch(e){
    console.error(e);
  const code = (e as { code?:string })?.code;
  if(code === 'SLOT_CONFLICT') return NextResponse.json({ error:'slot_conflict'},{ status:409 });
  if(code === 'SLOT_NOT_FOUND') return NextResponse.json({ error:'slot_not_found'},{ status:404 });
    return NextResponse.json({ error:'create_order_failed'},{ status:500 });
  }
}
