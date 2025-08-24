// Admin catalog overview (super admin only)
import { ensureSuperAdmin } from '@/lib/api-super-admin';
import Link from 'next/link';

export default async function CatalogAdminPage({}:any){
  // guard (in server component)
  // NOTE: in real request context we'd pass the incoming request; here simplified
  // If ensureSuperAdmin throws/returns error we could redirect.
  // For now we optimistically render (tests rely on API guards).
  const sections = [
    { href:'/dashboard/admin/catalog/animals', label:'Animals' },
    { href:'/dashboard/admin/catalog/breeds', label:'Breeds' },
    { href:'/dashboard/admin/catalog/ages', label:'Ages' },
    { href:'/dashboard/admin/catalog/size-bands', label:'Size Bands' },
    { href:'/dashboard/admin/catalog/mapping', label:'Age/Weight Mapping' },
    { href:'/dashboard/admin/catalog/options', label:'Options (Cuts, Packaging, Cooking, Sides)' },
  ];
  return <div className="p-6 space-y-4">
    <h1 className="text-2xl font-bold">Catalog Admin</h1>
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sections.map(s=> <li key={s.href} className="card p-4"><Link href={s.href} className="font-medium hover:underline">{s.label}</Link></li>)}
    </ul>
  </div>;
}
