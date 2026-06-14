'use client';

import { SectionLayout } from '../SectionLayout';
import { EmptyChart } from '@/components/dashboard/EmptyChart';

const MONTHLY = [
  { month: 'Jan', revenue: 210000, expenses: 45000 },
  { month: 'Feb', revenue: 280000, expenses: 52000 },
  { month: 'Mar', revenue: 320000, expenses: 48000 },
  { month: 'Apr', revenue: 390000, expenses: 61000 },
  { month: 'May', revenue: 420000, expenses: 58000 },
  { month: 'Jun', revenue: 475000, expenses: 65000 },
];

const naira = (n: number) => `₦${(n / 1000).toFixed(0)}K`;

export function FinanceAnalyticsClient() {
  const totalRevenue = MONTHLY.reduce((s, m) => s + m.revenue, 0);
  const totalExpenses = MONTHLY.reduce((s, m) => s + m.expenses, 0);

  return (
    <SectionLayout
      title="Finance Analytics"
      subtitle="Revenue trends, profit margins, and growth"
      stats={[
        { label: 'YTD Revenue', value: naira(totalRevenue), sub: '+34% vs last year' },
        { label: 'YTD Expenses', value: naira(totalExpenses) },
        { label: 'Net Profit', value: naira(totalRevenue - totalExpenses) },
        { label: 'Profit Margin', value: `${Math.round(((totalRevenue - totalExpenses) / totalRevenue) * 100)}%` },
      ]}
    >
      <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--adm-text)' }}>Revenue vs Expenses</p>
          <EmptyChart />
        </div>
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--adm-text)' }}>Monthly Breakdown</p>
          <div className="flex flex-col gap-3">
            {MONTHLY.map((m) => (
              <div key={m.month} className="flex items-center justify-between">
                <p className="text-xs w-8" style={{ color: 'var(--adm-muted)' }}>{m.month}</p>
                <div className="flex-1 flex gap-1 mx-3">
                  <div className="h-1.5 rounded-full bg-[#DC5B17]" style={{ width: `${(m.revenue / 475000) * 60}%` }} />
                  <div className="h-1.5 rounded-full bg-white/20" style={{ width: `${(m.expenses / 475000) * 60}%` }} />
                </div>
                <p className="text-xs shrink-0" style={{ color: 'var(--adm-muted)' }}>{naira(m.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
