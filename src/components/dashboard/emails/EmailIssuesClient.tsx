'use client';

import { useState } from 'react';
import { ArrowCounterClockwise, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Reason = 'bounced' | 'unsubscribed' | 'spam' | 'invalid';
type Issue = { id: string; email: string; reason: Reason; campaign: string; date: string; };

const MOCK: Issue[] = [
  { id: '1', email: 'old@email.com', reason: 'bounced', campaign: 'June Community Digest', date: '2026-06-12' },
  { id: '2', email: 'user@deleted.net', reason: 'invalid', campaign: 'June Community Digest', date: '2026-06-12' },
  { id: '3', email: 'noemail@test.com', reason: 'bounced', campaign: 'New course just dropped', date: '2026-06-10' },
  { id: '4', email: 'unsub@example.com', reason: 'unsubscribed', campaign: 'May Roundup', date: '2026-05-30' },
  { id: '5', email: 'report@user.com', reason: 'spam', campaign: 'April Newsletter', date: '2026-04-28' },
];

const R: Record<Reason, string> = {
  bounced:      'text-red-400 bg-red-400/10 border-red-400/20',
  unsubscribed: 'text-[#555] bg-white/5 border-white/10',
  spam:         'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  invalid:      'text-red-400 bg-red-400/10 border-red-400/20',
};

export function EmailIssuesClient() {
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? MOCK : MOCK.filter((i) => i.reason === filter);

  return (
    <SectionLayout
      title="Email Issues"
      subtitle="Bounced, invalid, and unsubscribed addresses"
      stats={[
        { label: 'Total Issues', value: MOCK.length },
        { label: 'Bounced', value: MOCK.filter((i) => i.reason === 'bounced').length },
        { label: 'Unsubscribed', value: MOCK.filter((i) => i.reason === 'unsubscribed').length },
        { label: 'Spam Reports', value: MOCK.filter((i) => i.reason === 'spam').length },
      ]}
      filters={['all', 'bounced', 'invalid', 'unsubscribed', 'spam']}
      active={filter}
      onFilter={setFilter}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Email', 'Reason', 'Campaign', 'Date', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((issue, i) => (
              <tr key={issue.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 text-sm font-mono" style={{ color: 'var(--adm-text)' }}>{issue.email}</td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize ${R[issue.reason]}`}>{issue.reason}</span></td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{issue.campaign}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{new Date(issue.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5 justify-end">
                    <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><ArrowCounterClockwise size={14} /></button>
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
