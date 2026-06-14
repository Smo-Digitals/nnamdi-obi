'use client';

import { useState } from 'react';
import { PencilSimple, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Plan = 'free' | 'premium' | 'vip';
type Status = 'active' | 'inactive';
type Member = { id: string; name: string; email: string; plan: Plan; joined: string; status: Status; };

const MOCK: Member[] = [
  { id: '1', name: 'Tunde Afolabi', email: 'tunde@email.com', plan: 'premium', joined: '2026-01-12', status: 'active' },
  { id: '2', name: 'Amaka Obi', email: 'amaka@email.com', plan: 'vip', joined: '2026-02-05', status: 'active' },
  { id: '3', name: 'Chike Eze', email: 'chike@email.com', plan: 'free', joined: '2026-03-18', status: 'active' },
  { id: '4', name: 'Fatima Bello', email: 'fatima@email.com', plan: 'premium', joined: '2026-04-02', status: 'inactive' },
  { id: '5', name: 'David Nwosu', email: 'david@email.com', plan: 'free', joined: '2026-05-14', status: 'active' },
  { id: '6', name: 'Ngozi Adeyemi', email: 'ngozi@email.com', plan: 'vip', joined: '2026-06-01', status: 'active' },
];

const PLAN: Record<Plan, string> = {
  free:    'text-[#888] bg-white/5 border-white/10',
  premium: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  vip:     'text-[#DC5B17] bg-[#DC5B17]/10 border-[#DC5B17]/20',
};

export function CommunityMembersClient() {
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? MOCK : MOCK.filter((m) => (filter === 'active' || filter === 'inactive') ? m.status === filter : m.plan === filter);

  return (
    <SectionLayout
      title="Members"
      subtitle="All community members across plans"
      stats={[
        { label: 'Total Members', value: MOCK.length },
        { label: 'Premium', value: MOCK.filter((m) => m.plan === 'premium').length },
        { label: 'VIP', value: MOCK.filter((m) => m.plan === 'vip').length },
        { label: 'Active', value: MOCK.filter((m) => m.status === 'active').length },
      ]}
      filters={['all', 'free', 'premium', 'vip', 'active', 'inactive']}
      active={filter}
      onFilter={setFilter}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Name', 'Email', 'Plan', 'Joined', 'Status', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((m, i) => (
              <tr key={m.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 text-sm font-medium" style={{ color: 'var(--adm-text)' }}>{m.name}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{m.email}</td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${PLAN[m.plan]}`}>{m.plan}</span></td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{new Date(m.joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${m.status === 'active' ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-[#555] bg-white/5 border-white/10'}`}>{m.status}</span></td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5 justify-end">
                    <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><PencilSimple size={14} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}><Trash size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionLayout>
  );
}
