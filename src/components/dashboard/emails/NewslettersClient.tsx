'use client';

import { useState } from 'react';
import { Eye, PencilSimple, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Status = 'sent' | 'draft' | 'scheduled';
type Campaign = { id: string; name: string; subject: string; subscribers: number; openRate: number; clickRate: number; date: string; status: Status; };

const MOCK: Campaign[] = [
  { id: '1', name: 'June Community Digest', subject: 'June Community Digest 🔥', subscribers: 1240, openRate: 42, clickRate: 12, date: '2026-06-12', status: 'sent' },
  { id: '2', name: 'May Roundup', subject: 'May — what happened and what\'s next', subscribers: 1180, openRate: 38, clickRate: 9, date: '2026-05-30', status: 'sent' },
  { id: '3', name: 'April Newsletter', subject: 'Big things coming in April 👀', subscribers: 1050, openRate: 44, clickRate: 14, date: '2026-04-28', status: 'sent' },
  { id: '4', name: 'July Newsletter', subject: 'July Newsletter Draft', subscribers: 0, openRate: 0, clickRate: 0, date: '2026-06-14', status: 'draft' },
  { id: '5', name: 'Platform Launch Edition', subject: 'Something big is live — come see', subscribers: 1240, openRate: 0, clickRate: 0, date: '2026-06-25', status: 'scheduled' },
];

const S: Record<Status, string> = {
  sent:      'text-green-400 bg-green-400/10 border-green-400/20',
  draft:     'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  scheduled: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
};

export function NewslettersClient() {
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? MOCK : MOCK.filter((c) => c.status === filter);

  return (
    <SectionLayout
      title="Newsletters"
      subtitle="Email campaigns and subscriber communications"
      cta={{ label: 'New Campaign', onClick: () => {} }}
      stats={[
        { label: 'Total Campaigns', value: MOCK.length },
        { label: 'Subscribers', value: '1,240' },
        { label: 'Avg. Open Rate', value: '41%' },
        { label: 'Avg. Click Rate', value: '12%' },
      ]}
      filters={['all', 'sent', 'draft', 'scheduled']}
      active={filter}
      onFilter={setFilter}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Campaign', 'Subscribers', 'Open Rate', 'Clicks', 'Date', 'Status', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={c.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 max-w-xs"><p className="text-sm font-medium" style={{ color: 'var(--adm-text)' }}>{c.name}</p><p className="text-xs truncate" style={{ color: 'var(--adm-muted)' }}>{c.subject}</p></td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{c.subscribers.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{c.status === 'sent' ? `${c.openRate}%` : '—'}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{c.status === 'sent' ? `${c.clickRate}%` : '—'}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{new Date(c.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${S[c.status]}`}>{c.status}</span></td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5 justify-end">
                    <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><Eye size={14} /></button>
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
