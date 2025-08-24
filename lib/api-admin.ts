import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

/**
 * Ensures the requester is an authenticated admin.
 * Returns NextResponse (403) if not authorized, otherwise null.
 */
export async function ensureAdminApi(req?:Request){
  // Fast path in tests: header-based auth (avoids importing next-auth / bcrypt stack)
  if(process.env.TEST_MODE === 'true' && req){
    const role = (req.headers.get('x-test-role')||'').toLowerCase();
    if(role === 'admin' || role === 'super_admin') return { session: { user:{ role } } } as any;
    return { error:'forbidden', status:403 } as any; // normalized error shape
  }
  // Lazy import auth options only when needed (keeps test runs light)
  const { authOptions } = await import('@/lib/auth');
  const session = await getServerSession(authOptions);
  const rawRole = (session?.user as any)?.role;
  const role = typeof rawRole === 'string' ? rawRole.toLowerCase() : undefined;
  if(!session || (role !== 'admin' && role !== 'super_admin')){
    return { error:'forbidden', status:403 } as any;
  }
  return { session };
}
