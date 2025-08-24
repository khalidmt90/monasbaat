import { test, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { makeReq } from './helpers/api';

async function superPost(path:string, body:any){
  const { POST } = await import(path);
  const req = makeReq('POST', path, body, { id:'super', role:'SUPER_ADMIN', email:'s@x' });
  return POST(req as any);
}

let hallId:string; let slotId:string;

beforeAll(async () => {
  const city = await prisma.city.upsert({ where:{ code:'AUD' }, update:{}, create:{ code:'AUD', nameAr:'تدقيق', nameEn:'AuditCity' } });
  const hall = await prisma.hall.create({ data:{ slug:`aud-h-${Date.now()}`, name:'Audit Hall', city: city.nameAr, cityId: city.id, basePrice:1000, sessions:[], amenities:[], images:[], isVerified:true } });
  hallId = hall.id;
});

// Covers: hall_slot_bulk_create, hall_slot_bulk_close, hall_slot_override, hall_slot_bulk_open_blocked_final

test('audit logs for slot lifecycle', async () => {
  const before = await prisma.auditLog.count();
  // create
  const bulkCreate = await superPost('@/app/api/admin/hall-slots/bulk/route', { action:'create', hallId, dates:[new Date(Date.now()+3*86400000).toISOString()], startTime:'18:00', endTime:'22:00' });
  expect((bulkCreate as any).status).toBe(200);
  const slot = await prisma.hallSlot.findFirst({ where:{ hallId } });
  slotId = slot!.id;
  // close
  const bulkClose = await superPost('@/app/api/admin/hall-slots/bulk/route', { action:'close', hallId, dates:[slot!.date.toISOString()], startTime:'18:00', endTime:'22:00' });
  expect((bulkClose as any).status).toBe(200);
  // override (reopen + set price)
  const override = await superPost('@/app/api/admin/hall-slots/override/route', { slotId, status:'open', priceMinor:12345 });
  expect((override as any).status).toBe(200);
  // mark final directly then attempt bulk open blocked
  await prisma.hallSlot.update({ where:{ id: slotId }, data:{ status:'final' } });
  const blocked = await superPost('@/app/api/admin/hall-slots/bulk/route', { action:'open', hallId, dates:[slot!.date.toISOString()], startTime:'18:00', endTime:'22:00' });
  expect((blocked as any).status).toBe(409);
  const after = await prisma.auditLog.count();
  const logs = await prisma.auditLog.findMany({ where:{ entityId: hallId } });
  const overrideLog = await prisma.auditLog.findFirst({ where:{ entity:'HallSlot', entityId: slotId, action:'hall_slot_override' } });
  expect(overrideLog).toBeTruthy();
  // Expect at least 4 new logs (create, close, override, blocked open)
  expect(after - before).toBeGreaterThanOrEqual(4);
  expect(logs.some((l:any)=> l.action==='hall_slot_bulk_create')).toBe(true);
  expect(logs.some((l:any)=> l.action==='hall_slot_bulk_close')).toBe(true);
  expect(logs.some((l:any)=> l.action==='hall_slot_bulk_open_blocked_final')).toBe(true);
});
