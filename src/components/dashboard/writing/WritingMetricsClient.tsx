'use client';

import { SectionLayout } from '../SectionLayout';
import { EmptyChart } from '@/components/dashboard/EmptyChart';

const TOP_POSTS = [
  { title: 'Building in public: lessons from year one', views: 4100 },
  { title: 'How to build a successful community online', views: 2840 },
  { title: 'The complete guide to online courses', views: 1920 },
  { title: 'The creator economy in 2026', views: 880 },
];

export function WritingMetricsClient() {
  return (
    <SectionLayout
      title="Writing Metrics"
      subtitle="Track performance across your posts and articles"
      stats={[
        { label: 'Total Views', value: '13,540', sub: '+18% this month' },
        { label: 'Published Posts', value: 3 },
        { label: 'Avg. Read Time', value: '4m 20s' },
        { label: 'Comments', value: 5 },
      ]}
    >
      <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--adm-text)' }}>Views Over Time</p>
          <EmptyChart />
        </div>
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--adm-text)' }}>Top Posts</p>
          <div className="flex flex-col gap-4">
            {TOP_POSTS.map((p) => (
              <div key={p.title}>
                <p className="text-xs font-medium truncate mb-1.5" style={{ color: 'var(--adm-text)' }}>{p.title}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/5">
                    <div className="h-1.5 rounded-full bg-[#DC5B17]" style={{ width: `${(p.views / 4100) * 100}%` }} />
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--adm-muted)' }}>{p.views.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
