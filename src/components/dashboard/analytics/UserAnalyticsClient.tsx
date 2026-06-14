'use client';

import { SectionLayout } from '../SectionLayout';
import { EmptyChart } from '@/components/dashboard/EmptyChart';

const COHORTS = [
  { month: 'Jan 2026', joined: 89, retained: 78, rate: 88 },
  { month: 'Feb 2026', joined: 124, retained: 108, rate: 87 },
  { month: 'Mar 2026', joined: 156, retained: 131, rate: 84 },
  { month: 'Apr 2026', joined: 198, retained: 162, rate: 82 },
  { month: 'May 2026', joined: 240, retained: 192, rate: 80 },
  { month: 'Jun 2026', joined: 312, retained: 248, rate: 79 },
];

export function UserAnalyticsClient() {
  return (
    <SectionLayout
      title="User Analytics"
      subtitle="Growth, retention, and user behaviour"
      stats={[
        { label: 'Total Users', value: '1,240', sub: '+312 this month' },
        { label: 'New This Month', value: '312' },
        { label: 'Avg. Retention', value: '83%' },
        { label: 'Churn Rate', value: '3.2%' },
      ]}
    >
      <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--adm-text)' }}>User Growth</p>
          <EmptyChart />
        </div>
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--adm-text)' }}>Monthly Cohorts</p>
          <div className="flex flex-col gap-2">
            {COHORTS.map((c) => (
              <div key={c.month} className="flex items-center gap-3">
                <p className="text-xs w-20 shrink-0" style={{ color: 'var(--adm-muted)' }}>{c.month}</p>
                <div className="flex-1 h-1.5 rounded-full bg-white/5">
                  <div className="h-1.5 rounded-full bg-[#DC5B17]" style={{ width: `${c.rate}%` }} />
                </div>
                <p className="text-xs shrink-0 w-8 text-right" style={{ color: 'var(--adm-muted)' }}>{c.rate}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
