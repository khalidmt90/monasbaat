import { test, expect } from 'vitest';
import { prisma } from '@/lib/prisma';

async function superPost(path:string, body:any){
  const headers = new Headers({ 'x-test-user':'super','x-test-role':'super_admin','content-type':'application/json' });
  const { POST } = await import(path);
  const req = new Request('http://localhost'+path,{ method:'POST', headers, body: JSON.stringify(body) });
  return POST(req as any);
}

// Minimal audit assertions to ensure each create writes a log

test('animal create writes audit log', async () => {
  // ensure clean state
  const code = 'AUD_ANIMAL_' + Date.now();
  await prisma.animal.deleteMany({ where:{ code } }).catch(()=>{});
  const { POST } = await import('@/app/api/admin/catalog/animals/route');
  const before = await prisma.auditLog.count();
  const req = new Request('http://localhost/api/admin/catalog/animals',{ method:'POST', headers: new Headers({ 'x-test-user':'super','x-test-role':'super_admin','content-type':'application/json' }), body: JSON.stringify({ action:'create', code, nameAr:'حيوان', nameEn:'Animal' }) });
  const res:any = await POST(req as any);
  const text = await (res as any).text?.();
  expect(res.status).toBe(200);
  const after = await prisma.auditLog.count();
  // Allow for other concurrent tests to also write audit logs; assert at least one new entry
  expect(after).toBeGreaterThan(before);
});

test('cut create writes audit log', async () => {
  const cutCode = 'AUD_CUT_' + Date.now();
  await prisma.cutPreset.deleteMany({ where:{ code:cutCode } }).catch(()=>{});
  const { POST } = await import('@/app/api/admin/catalog/cuts/route');
  const before = await prisma.auditLog.count();
  const req = new Request('http://localhost/api/admin/catalog/cuts',{ method:'POST', headers: new Headers({ 'x-test-user':'super','x-test-role':'super_admin','content-type':'application/json' }), body: JSON.stringify({ action:'create', code:cutCode, nameAr:'تقطيع', nameEn:'Cut', priceModifier:3 }) });
  const res:any = await POST(req as any);
  expect(res.status).toBe(200);
  const after = await prisma.auditLog.count();
  // Allow for other concurrent tests to also write audit logs; assert at least one new entry
  expect(after).toBeGreaterThan(before);
});
