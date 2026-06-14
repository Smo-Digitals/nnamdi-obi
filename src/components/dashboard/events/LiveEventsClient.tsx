'use client';

import { useState } from 'react';
import { PencilSimple, Trash, VideoCamera } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Status = 'upcoming' | 'live' | 'ended';
type Event = { id: string; title: string; type: string; date: string; attendees: number; capacity: number; status: Status; };

const MOCK: Event[] = [
  { id: '1', title: 'Community Building Q&A Live Session', type: 'Webinar', date: '2026-06-18T18:00', attendees: 89, capacity: 200, status: 'upcoming' },
  { id: '2', title: 'Creator Business Workshop', type: 'Workshop', date: '2026-06-15T15:00', attendees: 42, capacity: 50, status: 'live' },
  { id: '3', title: 'Monthly Member Masterclass', type: 'Masterclass', date: '2026-06-10T17:00', attendees: 134, capacity: 300, status: 'ended' },
  { id: '4', title: 'Course Creator Networking Night', type: 'Networking', date: '2026-06-25T19:00', attendees: 28, capacity: 100, status: 'upcoming' },
];

const S: Record<Status, string> = {
  upcoming: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  live:     'text-[#DC5B17] bg-[#DC5B17]/10 border-[#DC5B17]/20',
  ended:    'text-[#555] bg-white/5 border-white/10',
};

export function LiveEventsClient() {
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? MOCK : MOCK.filter((e) => e.status === filter);

  return (
    <SectionLayout
      title="Live Events"
      subtitle="Webinars, workshops, and live sessions"
      cta={{ label: 'Schedule Event', onClick: () => {} }}
      stats={[
        { label: 'Total', value: MOCK.length },
        { label: 'Upcoming', value: MOCK.filter((e) => e.status === 'upcoming').length },
        { label: 'Live Now', value: MOCK.filter((e) => e.status === 'live').length },
        { label: 'Total Seats', value: MOCK.reduce((s, e) => s + e.attendees, 0) },
      ]}
      filters={['all', 'upcoming', 'live', 'ended']}
      active={filter}
      onFilter={setFilter}
    >
      <div className="flex flex-col gap-3">
        {rows.map((e) => (
          <div key={e.id} className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <div className={`p-2.5 rounded-xl ${e.status === 'live' ? 'bg-[#DC5B17]/20 text-[#DC5B17]' : 'bg-white/5'}`} style={{ color: e.status !== 'live' ? 'var(--adm-muted)' : undefined }}>
              <VideoCamera size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{e.title}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${S[e.status]}`}>{e.status}</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>
                {e.type} · {new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} · {e.attendees}/{e.capacity} seats
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
