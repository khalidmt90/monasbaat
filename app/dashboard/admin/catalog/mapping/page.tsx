// Mapping grid scaffold
import { prisma } from '@/lib/prisma';
import { ensureSuperAdmin } from '@/lib/api-super-admin';

async function load(){
  const [animals, ages, bands, mappings] = await Promise.all([
    prisma.animal.findMany({ where:{ active:true }, orderBy:{ code:'asc' } }),
    prisma.age.findMany({ where:{ active:true }, orderBy:{ code:'asc' } }),
    prisma.sizeBand.findMany({ where:{ active:true }, orderBy:{ code:'asc' } }),
    prisma.ageWeightMapping.findMany({ orderBy:{ updatedAt:'desc' } })
  ]);
  return { animals, ages, bands, mappings };
}

export default async function MappingAdminPage(){
  const data = await load();
  return <div className="p-6 space-y-4">
    <h1 className="text-xl font-bold">Age / Weight Mapping</h1>
    <p className="text-sm text-gray-600">Lightweight read-only grid (server rendered) — future enhancement: client editing.</p>
    <div className="overflow-auto border rounded">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="p-2">Animal Code</th>
            <th className="p-2">Age Code</th>
            <th className="p-2">Size Band</th>
            <th className="p-2">Est. Weight (Kg)</th>
            <th className="p-2">Base Modifier</th>
            <th className="p-2">Updated</th>
          </tr>
        </thead>
        <tbody>
          {data.mappings.map((m:any) => {
            const age = data.ages.find((a:any)=>a.id===m.ageId);
            const animal = data.animals.find((a:any)=>a.id===m.animalId) || data.animals.find((a:any)=>a.code===m.animalType);
            const band = data.bands.find((b:any)=>b.id===m.sizeBandId);
            return <tr key={m.id} className="border-t">
              <td className="p-2 font-mono">{animal?.code}</td>
              <td className="p-2 font-mono">{age?.code}</td>
              <td className="p-2 font-mono">{band?.code||'—'}</td>
              <td className="p-2">{m.estimatedWeightKg}</td>
              <td className="p-2">{m.basePriceModifier}</td>
              <td className="p-2 text-xs text-gray-500">{new Date(m.updatedAt).toLocaleDateString()}</td>
            </tr>;
          })}
          {data.mappings.length===0 && <tr><td className="p-4 text-center text-gray-500" colSpan={6}>No mappings</td></tr>}
        </tbody>
      </table>
    </div>
  </div>;
}
