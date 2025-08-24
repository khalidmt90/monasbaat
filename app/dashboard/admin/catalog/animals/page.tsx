// Animals admin list (read-only scaffold)
import { prisma } from '@/lib/prisma';

export default async function AnimalsAdmin(){
  const animals = await prisma.animal.findMany({ orderBy:{ code:'asc' } });
  return <div className="p-6 space-y-4">
    <h1 className="text-xl font-bold">Animals</h1>
    <table className="min-w-full text-sm border">
      <thead className="bg-gray-50">
        <tr><th className="p-2 text-left">Code</th><th className="p-2 text-left">Arabic</th><th className="p-2 text-left">English</th><th className="p-2">Active</th></tr>
      </thead>
      <tbody>
  {animals.map((a:any)=> <tr key={a.id} className="border-t"><td className="p-2 font-mono">{a.code}</td><td className="p-2">{a.nameAr}</td><td className="p-2">{a.nameEn}</td><td className="p-2 text-center">{a.active? '✅':'❌'}</td></tr>)}
        {animals.length===0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">No animals</td></tr>}
      </tbody>
    </table>
  </div>;
}
