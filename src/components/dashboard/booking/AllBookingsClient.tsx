'use client';

import { useState } from 'react';
import { Eye, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Status = 'confirmed' | 'pending' | 'cancelled' | 'completed';
type Booking = { id: string; client: string; service: string; date: string; duration: string; amount: number; status: Status; };

const MOCK: Booking[] = [
  { id: '1', client: 'Tunde Afolabi', service: '1:1 Strategy Call', date: '2026-06-18T10:00', duration: '60 min', amount: 50000, status: 'confirmed' },
  { id: '2', client: 'Amaka Obi', service: 'Business Audit', date: '2026-06-16T14:00', duration: '90 min', amount: 75000, status: 'confirmed' },
  { id: '3', client: 'Chike Eze', service: '1:1 Strategy Call', date: '2026-06-10T11:00', duration: '60 min', amount: 50000, status: 'completed' },
  { id: '4', client: 'Fatima Bello', service: 'Course Consultation', date: '2026-06-20T15:00', duration: '45 min', amount: 30000, status: 'pending' },
  { id: '5', client: 'David Nwosu', service: '1:1 Strategy Call', date: '2026-06-08T09:00', duration: '60 min', amount: 50000, status: 'cancelled' },
];

const S: Record<Status, string> = {
  confirmed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  pending:   'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  completed: 'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const naira = (n: number) => `₦${n.toLocaleString()}`;

export function AllBookingsClient() {
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? MOCK : MOCK.filter((b) => b.status === filter);

  return (
    <SectionLayout
      title="All Bookings"
      subtitle="Manage 1:1 calls, consultations, and sessions"
      stats={[
        { label: 'Total', value: MOCK.length },
        { label: 'Confirmed', value: MOCK.filter((b) => b.status === 'confirmed').length },
        { label: 'Pending', value: MOCK.filter((b) => b.status === 'pending').length },
        { label: 'Revenue', value: naira(MOCK.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.amount, 0)) },
      ]}
      filters={['all', 'confirmed', 'pending', 'completed', 'cancelled']}
      active={filter}
      onFilter={setFilter}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Client', 'Service', 'Date', 'Duration', 'Amount', 'Status', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((b, i) => (
              <tr key={b.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 text-sm font-medium" style={{ color: 'var(--adm-text)' }}>{b.client}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{b.service}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>
                  {new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{b.duration}</td>
                <td className="px-4 py-3.5 text-sm font-medium" style={{ color: 'var(--adm-text)' }}>{naira(b.amount)}</td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${S[b.status]}`}>{b.status}</span></td>
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
