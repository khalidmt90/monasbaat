import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
import { ensureAdminApi } from '@/lib/api-admin';

// Worker/cron endpoint (protect via secret header) Cancels expired pending_payment orders
export async function POST(req:Request){
  const guard = await ensureAdminApi(req);
  if((guard as any)?.error){
    return NextResponse.json({ error:'forbidden'},{ status:403 });
  }
  try {
    const now = new Date();
    const p:any = prisma as any;
    const expired = await p.order.findMany({ where:{ status:'pending_payment', expiresAt:{ lt: now } }, select:{ id:true } });
    let released = 0;
    for(const o of expired){
      // Find hall bookings linked to slots
      const bookings = await p.hallBooking.findMany({ where:{ orderId: o.id, slotId:{ not: null } }, select:{ id:true, slotId:true } });
      // Update order
      await p.order.update({ where:{ id:o.id }, data:{ status:'cancelled_unpaid' }});
      // Release slots
      for(const b of bookings){
        if(b.slotId){
          await p.hallSlot.update({ where:{ id: b.slotId }, data:{ status:'open' } });
          await p.slotLock.delete({ where:{ slotId: b.slotId } }).catch(()=>{});
          released++;
          await p.auditLog.create({ data:{ action:'slot_unlock', entity:'HallSlot', entityId: b.slotId, meta:{ orderId: o.id } } });
        }
      }
      await p.auditLog.create({ data:{ action:'order_cancelled_unpaid', entity:'Order', entityId: o.id } });
    }
    return NextResponse.json({ cancelled: expired.length, slots_released: released });
  } catch(e){
    console.error(e);
    return NextResponse.json({ error:'cancel_failed'},{ status:500 });
  }
}
