'use client';

import { useState } from 'react';
import { SectionLayout } from '../SectionLayout';

type Source = 'courses' | 'bookings' | 'templates' | 'subscriptions';
type Status = 'paid' | 'pending' | 'refunded';
type Transaction = { id: string; description: string; source: Source; amount: number; date: string; status: Status; };

const MOCK: Transaction[] = [
  { id: '1', description: 'Community Building Masterclass', source: 'courses', amount: 49000, date: '2026-06-13', status: 'paid' },
  { id: '2', description: '1:1 Strategy Call — Tunde Afolabi', source: 'bookings', amount: 50000, date: '2026-06-12', status: 'paid' },
  { id: '3', description: 'Premium Membership — Monthly', source: 'subscriptions', amount: 15000, date: '2026-06-12', status: 'paid' },
  { id: '4', description: 'Community Launch Kit Template', source: 'templates', amount: 9500, date: '2026-06-11', status: 'paid' },
  { id: '5', description: 'Marketing Fundamentals Course', source: 'courses', amount: 19000, date: '2026-06-10', status: 'paid' },
  { id: '6', description: 'Business Audit — Amaka Obi', source: 'bookings', amount: 75000, date: '2026-06-09', status: 'pending' },
  { id: '7', description: 'Course Creation Bootcamp', source: 'courses', amount: 35000, date: '2026-06-08', status: 'refunded' },
];

const SOURCE: Record<Source, string> = {
  courses:       'text-blue-400 bg-blue-400/10 border-blue-400/20',
  bookings:      'text-[#DC5B17] bg-[#DC5B17]/10 border-[#DC5B17]/20',
  templates:     'text-purple-400 bg-purple-400/10 border-purple-400/20',
  subscriptions: 'text-green-400 bg-green-400/10 border-green-400/20',
};

const STATUS: Record<Status, string> = {
  paid:     'text-green-400 bg-green-400/10 border-green-400/20',
  pending:  'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  refunded: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const naira = (n: number) => `₦${n.toLocaleString()}`;

export function EarningsClient() {
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? MOCK : MOCK.filter((t) => t.source === filter || t.status === filter);
  const totalPaid = MOCK.filter((t) => t.status === 'paid').reduce((s, t) => s + t.amount, 0);

  return (
    <SectionLayout
      title="Earnings"
      subtitle="Revenue across all income streams"
      stats={[
        { label: 'Total Earned', value: naira(totalPaid), sub: '+24% this month' },
        { label: 'Courses', value: naira(MOCK.filter((t) => t.source === 'courses' && t.status === 'paid').reduce((s, t) => s + t.amount, 0)) },
        { label: 'Bookings', value: naira(MOCK.filter((t) => t.source === 'bookings' && t.status === 'paid').reduce((s, t) => s + t.amount, 0)) },
        { label: 'Pending', value: naira(MOCK.filter((t) => t.status === 'pending').reduce((s, t) => s + t.amount, 0)) },
      ]}
      filters={['all', 'courses', 'bookings', 'templates', 'subscriptions']}
      active={filter}
      onFilter={setFilter}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Description', 'Source', 'Amount', 'Date', 'Status'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => (
              <tr key={t.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 text-sm font-medium" style={{ color: 'var(--adm-text)' }}>{t.description}</td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize ${SOURCE[t.source]}`}>{t.source}</span></td>
                <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{naira(t.amount)}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>
                  {new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${STATUS[t.status]}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionLayout>
  );
}
