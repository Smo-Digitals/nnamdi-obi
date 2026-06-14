'use client';

import { useState } from 'react';
import { PencilSimple, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Plan = 'free' | 'premium' | 'vip';
type Role = 'member' | 'editor' | 'admin';
type Status = 'active' | 'inactive' | 'banned';
type User = { id: string; name: string; email: string; plan: Plan; role: Role; joined: string; status: Status; };

const MOCK: User[] = [
  { id: '1', name: 'Tunde Afolabi', email: 'tunde@email.com', plan: 'premium', role: 'member', joined: '2026-01-12', status: 'active' },
  { id: '2', name: 'Amaka Obi', email: 'amaka@email.com', plan: 'vip', role: 'member', joined: '2026-02-05', status: 'active' },
  { id: '3', name: 'Chike Eze', email: 'chike@nnamdiobi.com', plan: 'vip', role: 'editor', joined: '2026-01-01', status: 'active' },
  { id: '4', name: 'Fatima Bello', email: 'fatima@email.com', plan: 'premium', role: 'member', joined: '2026-04-02', status: 'inactive' },
  { id: '5', name: 'David Nwosu', email: 'david@email.com', plan: 'free', role: 'member', joined: '2026-05-14', status: 'active' },
  { id: '6', name: 'Ngozi Adeyemi', email: 'ngozi@email.com', plan: 'vip', role: 'member', joined: '2026-06-01', status: 'active' },
  { id: '7', name: 'Emeka Okonkwo', email: 'emeka@email.com', plan: 'free', role: 'member', joined: '2026-06-10', status: 'active' },
  { id: '8', name: 'Chisom Eze', email: 'chisom@email.com', plan: 'free', role: 'member', joined: '2026-06-13', status: 'active' },
];

const PLAN: Record<Plan, string> = {
  free:    'text-[#888] bg-white/5 border-white/10',
  premium: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  vip:     'text-[#DC5B17] bg-[#DC5B17]/10 border-[#DC5B17]/20',
};

const ROLE: Record<Role, string> = {
  member: 'text-[#555] bg-white/5 border-white/10',
  editor: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  admin:  'text-[#DC5B17] bg-[#DC5B17]/10 border-[#DC5B17]/20',
};

const STATUS: Record<Status, string> = {
  active:   'text-green-400 bg-green-400/10 border-green-400/20',
  inactive: 'text-[#555] bg-white/5 border-white/10',
  banned:   'text-red-400 bg-red-400/10 border-red-400/20',
};

export function AllUsersClient() {
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? MOCK
    : filter === 'active' || filter === 'inactive' ? MOCK.filter((u) => u.status === filter)
    : MOCK.filter((u) => u.plan === filter || u.role === filter);

  return (
    <SectionLayout
      title="All Users"
      subtitle="Manage all registered users and their access"
      stats={[
        { label: 'Total Users', value: MOCK.length },
        { label: 'Premium', value: MOCK.filter((u) => u.plan === 'premium' || u.plan === 'vip').length },
        { label: 'Active', value: MOCK.filter((u) => u.status === 'active').length },
        { label: 'New This Month', value: MOCK.filter((u) => u.joined.startsWith('2026-06')).length },
      ]}
      filters={['all', 'active', 'inactive', 'free', 'premium', 'vip']}
      active={filter}
      onFilter={setFilter}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Name', 'Email', 'Plan', 'Role', 'Joined', 'Status', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((u, i) => (
              <tr key={u.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 text-sm font-medium" style={{ color: 'var(--adm-text)' }}>{u.name}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{u.email}</td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${PLAN[u.plan]}`}>{u.plan}</span></td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize ${ROLE[u.role]}`}>{u.role}</span></td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{new Date(u.joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${STATUS[u.status]}`}>{u.status}</span></td>
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
