import { NextRequest } from 'next/server';
import { prisma } from '../../lib/prisma';

// Lightweight in-process invocation helpers for route handlers.
export function buildHeaders(user:{ id:string; role?:string; email?:string }|null|undefined){
  const h = new Headers();
  if(user){
    h.set('x-test-user', user.id);
    h.set('x-test-role', user.role||'USER');
    if(user.email) h.set('x-test-email', user.email);
  }
  return h;
}

export function makeReq(method:string, url:string, body?:any, user?:{ id:string; role?:string; email?:string }){
  const init: RequestInit = { method, headers: buildHeaders(user||null) };
  if(body){ init.body = JSON.stringify(body); (init.headers as Headers).set('content-type','application/json'); }
  return new NextRequest(new URL(url, 'http://localhost').toString(), init as any);
}

export async function createTestUser(role:string='USER'){
  const email = `u_${role.toLowerCase()}@t.dev`;
  const max=5; let attempt=0;
  while(true){
    try {
      return await prisma.user.upsert({ where:{ email }, update:{ role }, create:{ email, password:'x', role } });
    } catch(e:any){
      const code = e?.code; // Prisma error code
      if(code==='P1008' && attempt < max){
        await new Promise(r=>setTimeout(r, 50 * (attempt+1)));
        attempt++; continue;
      }
      throw e;
    }
  }
}
