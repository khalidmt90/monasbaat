import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function ensureSuperAdmin(req?:Request){
  if(process.env.TEST_MODE==='true' && req){
    const role = (req.headers.get('x-test-role')||'').toLowerCase();
    if(role==='super_admin') return { ok:true };
    return { error:'forbidden', status:403 } as any;
  }
  const { authOptions } = await import('@/lib/auth');
  const session = await getServerSession(authOptions);
  const rawRole = (session?.user as any)?.role;
  if(typeof rawRole==='string' && rawRole.toLowerCase()==='super_admin') return { ok:true };
  return NextResponse.json({ error:'forbidden'},{ status:403 });
}