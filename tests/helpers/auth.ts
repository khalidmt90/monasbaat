import type { IncomingHttpHeaders } from 'http';

export function authHeaders(user: { id:string; role?:string; email?:string }){
  return {
    'x-test-user': user.id,
    'x-test-role': user.role || 'USER',
    ...(user.email? { 'x-test-email': user.email }: {})
  } as Record<string,string>;
}
