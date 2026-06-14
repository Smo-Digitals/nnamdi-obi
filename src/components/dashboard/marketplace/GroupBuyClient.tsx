'use client';

import { Users, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Status = 'active' | 'completed' | 'cancelled';
type Deal = { id: string; name: string; price: number; target: number; current: number; endsAt: string; status: Status; };

const MOCK: Deal[] = [
  { id: '1', name: 'Community Building Masterclass - Group Deal', price: 25000, target: 20, current: 14, endsAt: '2026-06-20', status: 'active' },
  { id: '2', name: 'Creator Starter Pack - Group Buy', price: 40000, target: 15, current: 15, endsAt: '2026-06-10', status: 'completed' },
  { id: '3', name: 'Marketing Fundamentals Group Buy', price: 12000, target: 30, current: 8, endsAt: '2026-06-25', status: 'active' },
];

const S: Record<Status, string> = {
  active:    'text-blue-400 bg-blue-400/10 border-blue-400/20',
  completed: 'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const naira = (n: number) => `₦${n.toLocaleString()}`;

export function GroupBuyClient() {
  return (
    <SectionLayout
      title="Group Buy"
      subtitle="Group purchase deals with discounted pricing"
      cta={{ label: 'New Deal', onClick: () => {} }}
      stats={[
        { label: 'Active Deals', value: MOCK.filter((d) => d.status === 'active').length },
        { label: 'Completed', value: MOCK.filter((d) => d.status === 'completed').length },
        { label: 'Total Participants', value: MOCK.reduce((s, d) => s + d.current, 0) },
      ]}
    >
      <div className="flex flex-col gap-3">
        {MOCK.map((d) => (
          <div key={d.id} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{d.name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${S[d.status]}`}>{d.status}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>Ends {new Date(d.endsAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {naira(d.price)} per seat</p>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}><Trash size={14} /></button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-white/5">
                <div className="h-2 rounded-full bg-[#DC5B17]" style={{ width: `${Math.min((d.current / d.target) * 100, 100)}%` }} />
              </div>
              <div className="flex items-center gap-1.5 text-xs shrink-0" style={{ color: 'var(--adm-muted)' }}>
                <Users size={13} />
                {d.current} / {d.target}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
