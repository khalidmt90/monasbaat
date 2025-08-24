import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface QuoteRequest {
  lineItems: Array<{ kind:'dhabaeh'; animalId:string; breedId?:string; ageId:string; cuts?:string[]; packaging?:string[]; cooking?:string[]; sides?:string[] }>;
  context: { mode:'standalone'|'hall-addon'; cityId:string; deliveryMethod:'home'|'hall' };
}

function halfUp(n:number){ return Math.round(n); }

export async function POST(req:Request){
  try{
    const body = await req.json() as QuoteRequest;
    if(!body.lineItems?.length) return NextResponse.json({ error:'validation_no_items'},{ status:400 });
    const cityId = body.context?.cityId; const deliveryMethod = body.context?.deliveryMethod;
    if(!cityId||!deliveryMethod) return NextResponse.json({ error:'validation_context'},{ status:400 });

    const tax = await prisma.taxSetting.findFirst({ where:{ isActive:true } });
    const discounts = await prisma.discountRule.findMany({ where:{ active:true }, orderBy:{ priority:'asc' } });
    const deliveryFeeRow = await prisma.pricingDeliveryFee.findFirst({ where:{ cityId, deliveryMethod, isActive:true } });

    let subtotal = 0; const items:any[] = []; const derived:any[] = [];

    for(let i=0;i<body.lineItems.length;i++){
      const li = body.lineItems[i];
      // mapping
      const mapping = await prisma.ageWeightMapping.findFirst({ where:{ animalId: li.animalId, ageId: li.ageId } });
      if(!mapping) return NextResponse.json({ error:'missing_mapping', index:i }, { status:400 });
      const sizeBandId = mapping.sizeBandId || undefined;
      const estimatedWeightKg = mapping.estimatedWeightKg;
      const modifierPct = (mapping.basePriceModifier||0)/10000; // stored as basis points
      // base price row
      const baseRow = await prisma.basePriceMatrix.findFirst({ where:{ animalId: li.animalId, breedId: li.breedId??null, ageId: li.ageId, sizeBandId: sizeBandId??null, isActive:true } });
      if(!baseRow) return NextResponse.json({ error:'missing_base_price', index:i }, { status:400 });
      let base = baseRow.unitPriceMinor * (baseRow.priceMode==='per_kg' ? estimatedWeightKg : 1);
      base = halfUp(base * (1 + modifierPct));
      const modifiersBreakdown:any[] = [];
      // gather modifiers
      const allSelected = [ ['cut', li.cuts], ['packaging', li.packaging], ['cooking', li.cooking], ['side', li.sides] ] as const;
      const modifierIds = (allSelected.flatMap(([kind, arr])=> (arr||[]).map(id=>({ kind, id }))));
      if(modifierIds.length){
        const dbMods = await prisma.modifierPrice.findMany({ where:{ kind: { in: modifierIds.map(m=> m.kind as any) }, refId:{ in: modifierIds.map(m=> m.id) }, isActive:true } });
        for(const sel of modifierIds){
          const row = dbMods.find((m:any)=> m.kind===sel.kind && m.refId===sel.id); if(!row) return NextResponse.json({ error:'inactive_modifier', kind: sel.kind, id: sel.id }, { status:400 });
          let add=0;
          if(row.calcType==='per_kg') add = (row.amountMinor||0) * estimatedWeightKg;
          else if(row.calcType==='per_unit') add = (row.amountMinor||0);
          else if(row.calcType==='flat_per_order') add = (row.amountMinor||0);
          else if(row.calcType==='pct_of_base') add = halfUp(base * ((row.pctBps||0)/10000));
          modifiersBreakdown.push({ id: row.id, kind: row.kind, amount:add });
          base += add; // accumulate into item total base + modifiers
        }
      }
      subtotal += base;
      items.push({ lineId: i, breakdown:{ base, modifiers: modifiersBreakdown, mapping_pct: modifierPct }, total_minor: base });
      derived.push({ lineId: i, sizeBandId, estimatedWeightKg });
    }

    const subtotalBeforeDiscounts = subtotal;

    // delivery
    let deliveryFee = 0;
    if(deliveryFeeRow){
      if(subtotal < deliveryFeeRow.minOrderMinor) deliveryFee = deliveryFeeRow.baseFeeMinor; else deliveryFee = 0;
    } else {
      return NextResponse.json({ error:'invalid_delivery'},{ status:400 });
    }

    // discounts
    const discountLines:any[] = [];
    let runningSubtotal = subtotal;
    for(const rule of discounts){
      if(!rule.active) continue;
      if(rule.scope==='hall_addon_only' && body.context.mode!=='hall-addon') continue;
      if(rule.scope==='dhabaeh_only' && body.context.mode==='hall-addon') continue;
      const cond = rule.condition as any;
      const now = new Date();
      if(cond.date_from && new Date(cond.date_from) > now) continue;
      if(cond.date_to && new Date(cond.date_to) < now) continue;
      if(cond.min_subtotal_minor && runningSubtotal < cond.min_subtotal_minor) continue;
      let amount=0;
      const action = rule.action as any;
      if(action.type==='flat') amount = action.amount_minor||0;
      else if(action.type==='pct') amount = halfUp(runningSubtotal * ((action.pct_bps||0)/10000));
      if(action.cap_minor && amount > action.cap_minor) amount = action.cap_minor;
      if(amount>0){
        runningSubtotal -= amount;
        discountLines.push({ id: rule.id, name: rule.name, amount_minor: amount });
      }
    }

    const vatPercent = tax?.vatPercent||0;
    const vatBase = runningSubtotal + deliveryFee;
    const vat = halfUp(vatBase * (vatPercent/10000));
    const grand = runningSubtotal + deliveryFee + vat;

    return NextResponse.json({ currency:'SAR', minor:true, items, delivery_fee_minor: deliveryFee, discount_lines: discountLines, vat_minor: vat, subtotal_before_discounts_minor: subtotalBeforeDiscounts, subtotal_after_discounts_minor: runningSubtotal, grand_total_minor: grand, derived });
  }catch(e){
    return NextResponse.json({ error:'quote_failed'},{ status:500 });
  }
}
