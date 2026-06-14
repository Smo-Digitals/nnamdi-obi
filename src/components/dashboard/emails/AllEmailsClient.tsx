'use client';

import { useState } from 'react';
import { Eye } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Type = 'newsletter' | 'transactional' | 'update' | 'announcement';
type Status = 'sent' | 'scheduled' | 'draft' | 'failed';
type Email = { id: string; subject: string; type: Type; recipients: number; openRate: number; date: string; status: Status; };

const MOCK: Email[] = [
  { id: '1', subject: 'June Community Digest 🔥', type: 'newsletter', recipients: 1240, openRate: 42, date: '2026-06-12', status: 'sent' },
  { id: '2', subject: 'New course just dropped: Community Building Masterclass', type: 'update', recipients: 1240, openRate: 38, date: '2026-06-10', status: 'sent' },
  { id: '3', subject: 'Your payment receipt — Order #4821', type: 'transactional', recipients: 1, openRate: 100, date: '2026-06-13', status: 'sent' },
  { id: '4', subject: 'Important platform update — New features', type: 'announcement', recipients: 1240, openRate: 0, date: '2026-06-20', status: 'scheduled' },
  { id: '5', subject: 'July Newsletter Draft', type: 'newsletter', recipients: 0, openRate: 0, date: '2026-06-14', status: 'draft' },
];

const TYPE: Record<Type, string> = {
  newsletter:    'text-blue-400 bg-blue-400/10 border-blue-400/20',
  transactional: 'text-[#888] bg-white/5 border-white/10',
  update:        'text-purple-400 bg-purple-400/10 border-purple-400/20',
  announcement:  'text-[#DC5B17] bg-[#DC5B17]/10 border-[#DC5B17]/20',
};

const STATUS: Record<Status, string> = {
  sent:      'text-green-400 bg-green-400/10 border-green-400/20',
  scheduled: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  draft:     'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  failed:    'text-red-400 bg-red-400/10 border-red-400/20',
};

export function AllEmailsClient() {
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? MOCK : MOCK.filter((e) => e.status === filter || e.type === filter);

  return (
    <SectionLayout
      title="All Emails"
      subtitle="Complete history of sent and scheduled emails"
      stats={[
        { label: 'Total', value: MOCK.length },
        { label: 'Sent', value: MOCK.filter((e) => e.status === 'sent').length },
        { label: 'Avg. Open Rate', value: '42%' },
        { label: 'Subscribers', value: '1,240' },
      ]}
      filters={['all', 'sent', 'scheduled', 'draft']}
      active={filter}
      onFilter={setFilter}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Subject', 'Type', 'Recipients', 'Open Rate', 'Date', 'Status', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((e, i) => (
              <tr key={e.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 max-w-xs"><p className="text-sm font-medium truncate" style={{ color: 'var(--adm-text)' }}>{e.subject}</p></td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize ${TYPE[e.type]}`}>{e.type}</span></td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{e.recipients.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{e.status === 'sent' ? `${e.openRate}%` : '—'}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${STATUS[e.status]}`}>{e.status}</span></td>
                <td className="px-4 py-3.5"><button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><Eye size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionLayout>
  );
}
