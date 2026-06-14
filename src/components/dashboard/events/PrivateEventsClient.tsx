'use client';

import { LockSimple, PencilSimple, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Status = 'upcoming' | 'ended';
type Event = { id: string; title: string; type: string; date: string; members: number; maxSeats: number; status: Status; };

const MOCK: Event[] = [
  { id: '1', title: 'Premium Member Mastermind', type: 'Mastermind', date: '2026-06-19T17:00', members: 12, maxSeats: 15, status: 'upcoming' },
  { id: '2', title: 'VIP Creator Cohort — Intake 3', type: 'Cohort', date: '2026-07-01T10:00', members: 8, maxSeats: 20, status: 'upcoming' },
  { id: '3', title: 'Private Business Strategy Day', type: '1-on-1 Group', date: '2026-06-05T09:00', members: 5, maxSeats: 5, status: 'ended' },
];

const S: Record<Status, string> = {
  upcoming: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  ended:    'text-[#555] bg-white/5 border-white/10',
};

export function PrivateEventsClient() {
  return (
    <SectionLayout
      title="Private Events"
      subtitle="Exclusive cohorts, masterminds, and closed-door sessions"
      cta={{ label: 'Create Private Event', onClick: () => {} }}
      stats={[
        { label: 'Total', value: MOCK.length },
        { label: 'Upcoming', value: MOCK.filter((e) => e.status === 'upcoming').length },
        { label: 'Members Enrolled', value: MOCK.reduce((s, e) => s + e.members, 0) },
      ]}
    >
      <div className="flex flex-col gap-3">
        {MOCK.map((e) => (
          <div key={e.id} className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <div className="p-2.5 rounded-xl bg-white/5" style={{ color: 'var(--adm-muted)' }}>
              <LockSimple size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{e.title}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${S[e.status]}`}>{e.status}</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>
                {e.type} · {new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {e.members}/{e.maxSeats} members
              </p>
            </div>
            <div className="flex gap-1.5">
              <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><PencilSimple size={14} /></button>
              <button className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}><Trash size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
