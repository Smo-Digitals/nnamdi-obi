'use client';

import { PencilSimple, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Role = 'editor' | 'contributor';
type Editor = { id: string; name: string; email: string; posts: number; lastActive: string; role: Role; };

const MOCK: Editor[] = [
  { id: '1', name: 'Amaka Obi', email: 'amaka@nnamdiobi.com', posts: 14, lastActive: '2026-06-13', role: 'editor' },
  { id: '2', name: 'Chike Eze', email: 'chike@nnamdiobi.com', posts: 8, lastActive: '2026-06-11', role: 'contributor' },
  { id: '3', name: 'Fatima Bello', email: 'fatima@nnamdiobi.com', posts: 5, lastActive: '2026-06-09', role: 'contributor' },
];

const ROLE: Record<Role, string> = {
  editor:      'text-blue-400 bg-blue-400/10 border-blue-400/20',
  contributor: 'text-[#888] bg-white/5 border-white/10',
};

export function WritingEditorsClient() {
  return (
    <SectionLayout
      title="Editors"
      subtitle="Manage writers and contributors"
      cta={{ label: 'Invite Editor', onClick: () => {} }}
      stats={[
        { label: 'Total Editors', value: MOCK.length },
        { label: 'Total Posts', value: MOCK.reduce((s, e) => s + e.posts, 0) },
      ]}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Name', 'Email', 'Posts', 'Last Active', 'Role', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK.map((e, i) => (
              <tr key={e.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 text-sm font-medium" style={{ color: 'var(--adm-text)' }}>{e.name}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{e.email}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{e.posts}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>
                  {new Date(e.lastActive).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize ${ROLE[e.role]}`}>{e.role}</span>
                </td>
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
