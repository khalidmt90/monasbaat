import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function getSessionUser(req?: Request){
  // Test-mode shortcut via headers (non-production)
  if(process.env.TEST_MODE === 'true' && req){
    const uid = req.headers.get('x-test-user');
    if(uid){
      const role = (req.headers.get('x-test-role') || 'USER').toUpperCase();
      const email = req.headers.get('x-test-email') || undefined;
      return { id: uid, role, email };
    }
  }
  // Lazy load auth options only when needed (avoids pulling bcrypt into vitest when header auth present)
  const { authOptions } = await import('@/lib/auth');
  const session = await getServerSession(authOptions);
  if(!session) return null;
  const u = session.user as any;
  return { id: u.id, role: (u.role||'USER').toUpperCase(), email: u.email };
}

export async function ensureAuthenticated(req?:Request){
  const u = await getSessionUser(req);
  if(!u) return NextResponse.json({ error:'auth_required'},{ status:401 });
  return u;
}

export async function ensureOrderOwner(orderId:string, req?:Request){
  const user = await getSessionUser(req);
  if(!user) return NextResponse.json({ error:'auth_required'},{ status:401 });
  // Admin bypass
  if(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return { user };
  if(!orderId) return NextResponse.json({ error:'invalid_id'},{ status:400 });
  const order = await prisma.order.findUnique({ where:{ id: orderId }, select:{ id:true, userId:true, customerEmail:true, customerPhone:true } });
  if(!order) return NextResponse.json({ error:'not_found'},{ status:404 });
  if(order.userId === user.id) return { user, order };
  // fallback phone/email match
  if(order.customerEmail && order.customerEmail === user.email) return { user, order };
  return NextResponse.json({ error:'forbidden'},{ status:403 });
}
