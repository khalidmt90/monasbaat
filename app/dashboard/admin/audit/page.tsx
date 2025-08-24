import React from 'react';

async function fetchLogs(query = ''){
  const res = await fetch('/api/admin/audit'+query, { cache: 'no-store' });
  return res.json();
}

export default async function Page({ searchParams }:{ searchParams?: any }){
  const qparts: string[] = [];
  if (searchParams?.action) qparts.push(`action=${encodeURIComponent(searchParams.action)}`);
  if (searchParams?.actorId) qparts.push(`actorId=${encodeURIComponent(searchParams.actorId)}`);
  const query = qparts.length ? `?${qparts.join('&')}` : '';
  const json:any = await fetchLogs(query);
  const logs = json?.data || [];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Audit Log (read-only)</h1>
      <p className="text-sm text-muted-foreground">Showing latest {logs.length} entries — actor, action, entity, when.</p>
      <div className="overflow-auto mt-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left">
              <th className="p-2">When</th>
              <th className="p-2">Actor</th>
              <th className="p-2">Role</th>
              <th className="p-2">Action</th>
              <th className="p-2">Entity</th>
              <th className="p-2">Meta</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l:any) => (
              <tr key={l.id} className="border-t">
                <td className="p-2">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="p-2">{l.actorId || 'system'}</td>
                <td className="p-2">{l.actorRole || '-'}</td>
                <td className="p-2">{l.action}</td>
                <td className="p-2">{l.entity}</td>
                <td className="p-2"><pre className="whitespace-pre-wrap">{JSON.stringify(l.meta || {}, null, 0)}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
