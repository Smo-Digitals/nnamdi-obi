'use client';

import { SectionLayout } from '../SectionLayout';
import { EmptyChart } from '@/components/dashboard/EmptyChart';

const BREAKDOWN = [
  { label: 'Courses', amount: 1030000, pct: 49 },
  { label: 'Bookings', amount: 625000, pct: 30 },
  { label: 'Subscriptions', amount: 315000, pct: 15 },
  { label: 'Templates', amount: 125000, pct: 6 },
];

const naira = (n: number) => `₦${(n / 100).toLocaleString()}K`;

export function FinancialMetricsClient() {
  return (
    <SectionLayout
      title="Financial Metrics"
      subtitle="Revenue trends, MRR, and income breakdown"
      stats={[
        { label: 'MRR', value: '₦350K', sub: '+8% month on month' },
        { label: 'ARR', value: '₦4.2M' },
        { label: 'LTV', value: '₦128K' },
        { label: 'Avg. Transaction', value: '₦38K' },
      ]}
    >
      <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--adm-text)' }}>Revenue Over Time</p>
          <EmptyChart />
        </div>
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--adm-text)' }}>Revenue Breakdown</p>
          <div className="flex flex-col gap-4">
            {BREAKDOWN.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between mb-1.5">
                  <p className="text-xs font-medium" style={{ color: 'var(--adm-text)' }}>{b.label}</p>
                  <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>{b.pct}%</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/5">
                    <div className="h-1.5 rounded-full bg-[#DC5B17]" style={{ width: `${b.pct}%` }} />
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--adm-muted)' }}>{naira(b.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
