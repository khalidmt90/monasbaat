import { test, beforeAll, expect } from 'vitest';
import { prisma } from '@/lib/prisma';
import { makeReq } from './helpers/api';

let hallId:string; let slotIds:string[] = [];

async function superReq(path:string, body:any){
  const { POST } = await import(path);
  const req = makeReq('POST', path, body, { id:'super', role:'SUPER_ADMIN', email:'s@x' });
  return POST(req as any);
}

beforeAll(async () => {
  const city = await prisma.city.upsert({ where:{ code:'LOG' }, update:{}, create:{ code:'LOG', nameAr:'لوجست', nameEn:'LogCity' } });
  const hall = await prisma.hall.create({ data:{ slug:`log-h-${Date.now()}`, name:'Log Hall', city: city.nameAr, cityId: city.id, basePrice:1000, sessions:[], amenities:[], images:[], isVerified:true } });
  hallId = hall.id;
  const { POST } = await import('@/app/api/admin/hall-slots/bulk/route');
  const dates = [0,1].map(i=> new Date(Date.now()+ (i+2)*86400000).toISOString());
  const req = new Request('http://localhost/api/admin/hall-slots/bulk',{ method:'POST', headers: new Headers({ 'x-test-user':'super','x-test-role':'super_admin','content-type':'application/json' }), body: JSON.stringify({ action:'create', hallId, dates, startTime:'18:00', endTime:'22:00' }) });
  const res = await POST(req as any); expect((res as any).status).toBe(200);
  const created = await prisma.hallSlot.findMany({ where:{ hallId } }); slotIds = created.map((s:any)=>s.id);
});

test('bulk close removes from availability', async () => {
  const availabilityBefore = await fetchAvailability(hallId);
  expect(availabilityBefore.length).toBeGreaterThan(0);
  const { POST } = await import('@/app/api/admin/hall-slots/bulk/route');
  const dates = [...new Set(slotIds.map(id=> (availabilityBefore[0].date)))];
  // Close using same time range
  const req = new Request('http://localhost/api/admin/hall-slots/bulk',{ method:'POST', headers: headers(), body: JSON.stringify({ action:'close', hallId, dates: availabilityBefore.map((s:any)=>s.date), startTime:'18:00', endTime:'22:00' }) });
  await POST(req as any);
  const after = await fetchAvailability(hallId);
  expect(after.length).toBe(0);
});

test('override price & capacity reflected', async () => {
  // reopen one slot
  const slot = await prisma.hallSlot.findFirst({ where:{ hallId } });
  if(slot){ await prisma.hallSlot.update({ where:{ id: slot.id }, data:{ status:'open' } }); }
  const { POST } = await import('@/app/api/admin/hall-slots/override/route');
  const oreq = new Request('http://localhost/api/admin/hall-slots/override',{ method:'POST', headers: headers(), body: JSON.stringify({ slotId: slot!.id, priceMinor: 150000, capacity: 7 }) });
  const ores = await POST(oreq as any); expect((ores as any).status).toBe(200);
  const avail = await fetchAvailability(hallId);
  expect(avail[0].priceMinor).toBe(150000);
  expect(avail[0].capacity).toBe(7);
});

test('unverified hall hidden', async () => {
  const hall = await prisma.hall.create({ data:{ slug:`unv-${Date.now()}`, name:'Hidden Hall', city:'X', basePrice:500, sessions:[], amenities:[], images:[], isVerified:false } });
  const { GET } = await import('@/app/api/halls/route');
  const resp = await GET();
  const arr:any = await resp.json();
  expect(arr.some((h:any)=> h.id === hall.id)).toBe(false);
});

test('cannot open final slot', async () => {
  const slot = await prisma.hallSlot.create({ data:{ hallId, date:new Date(Date.now()+5*86400000), startTime:'10:00', endTime:'12:00', status:'final' } });
  const { POST } = await import('@/app/api/admin/hall-slots/override/route');
  const req = new Request('http://localhost/api/admin/hall-slots/override',{ method:'POST', headers: headers(), body: JSON.stringify({ slotId: slot.id, status:'open' }) });
  const res = await POST(req as any);
  expect((res as any).status).toBe(409);
});

function headers(){ return new Headers({ 'x-test-user':'super','x-test-role':'super_admin','content-type':'application/json' }); }

async function fetchAvailability(hallId:string){
  const { POST } = await import('@/app/api/halls/availability/route');
  const start = new Date(Date.now()+86400000).toISOString();
  const end = new Date(Date.now()+10*86400000).toISOString();
  const req = new Request('http://localhost/api/halls/availability',{ method:'POST', headers: new Headers({ 'content-type':'application/json' }), body: JSON.stringify({ hall_id: hallId, date_range:{ start, end } }) });
  const res:any = await POST(req as any); const json:any = await res.json(); return json.slots;
}
