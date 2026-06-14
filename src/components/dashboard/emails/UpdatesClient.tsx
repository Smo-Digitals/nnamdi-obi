'use client';

import { Eye, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Update = { id: string; title: string; version: string; recipients: number; openRate: number; date: string; };

const MOCK: Update[] = [
  { id: '1', title: 'New course catalogue and improved search', version: 'v2.4', recipients: 1240, openRate: 35, date: '2026-06-10' },
  { id: '2', title: 'Community features — threads and reactions', version: 'v2.3', recipients: 1180, openRate: 31, date: '2026-05-22' },
  { id: '3', title: 'Booking system now live', version: 'v2.2', recipients: 1120, openRate: 44, date: '2026-04-30' },
  { id: '4', title: 'Dark mode and accessibility improvements', version: 'v2.1', recipients: 1050, openRate: 29, date: '2026-04-10' },
];

export function UpdatesClient() {
  return (
    <SectionLayout
      title="Product Updates"
      subtitle="Platform update emails sent to all members"
      cta={{ label: 'Send Update', onClick: () => {} }}
      stats={[
        { label: 'Total Updates', value: MOCK.length },
        { label: 'Avg. Open Rate', value: `${Math.round(MOCK.reduce((s, u) => s + u.openRate, 0) / MOCK.length)}%` },
        { label: 'Latest Version', value: 'v2.4' },
      ]}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Title', 'Version', 'Recipients', 'Open Rate', 'Date', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK.map((u, i) => (
              <tr key={u.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 text-sm font-medium" style={{ color: 'var(--adm-text)' }}>{u.title}</td>
                <td className="px-4 py-3.5"><span className="text-[10px] font-bold px-2 py-0.5 rounded-md border text-[#888] bg-white/5 border-white/10">{u.version}</span></td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{u.recipients.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{u.openRate}%</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{new Date(u.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5 justify-end">
                    <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><Eye size={14} /></button>
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
