'use client';

import { SectionLayout } from '../SectionLayout';
import { EmptyChart } from '@/components/dashboard/EmptyChart';

const TOP_PAGES = [
  { path: '/home', views: 4820 },
  { path: '/courses', views: 3210 },
  { path: '/community', views: 2180 },
  { path: '/events', views: 1540 },
  { path: '/marketplace', views: 890 },
];

export function AppAnalyticsClient() {
  return (
    <SectionLayout
      title="App Analytics"
      subtitle="Platform usage — sessions, pages, and retention"
      stats={[
        { label: 'DAU', value: '284', sub: '+6% vs last week' },
        { label: 'MAU', value: '1,240' },
        { label: 'Avg. Session', value: '8m 42s' },
        { label: 'Bounce Rate', value: '24%' },
      ]}
    >
      <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--adm-text)' }}>Daily Active Users</p>
          <EmptyChart />
        </div>
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--adm-text)' }}>Top Pages</p>
          <div className="flex flex-col gap-4">
            {TOP_PAGES.map((p) => (
              <div key={p.path}>
                <div className="flex justify-between mb-1.5">
                  <p className="text-xs font-mono" style={{ color: 'var(--adm-text)' }}>{p.path}</p>
                  <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>{p.views.toLocaleString()}</p>
                </div>
                <div className="h-1.5 rounded-full bg-white/5">
                  <div className="h-1.5 rounded-full bg-[#DC5B17]" style={{ width: `${(p.views / 4820) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
