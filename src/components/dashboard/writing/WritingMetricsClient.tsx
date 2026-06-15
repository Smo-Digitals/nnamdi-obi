'use client';

import { useEffect, useState } from 'react';
import { SectionLayout } from '../SectionLayout';

type Metrics = {
  totalViews:     number;
  totalPosts:     number;
  publishedPosts: number;
  draftPosts:     number;
  avgViews:       number;
  topPosts:       { id: string; title: string; views: number }[];
  monthlyData:    { month: string; count: number; views: number }[];
};

function BarChart({ data }: { data: { month: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-2 h-32 mt-2">
      {data.map((d) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px]" style={{ color: 'var(--adm-muted)' }}>{d.count || ''}</span>
          <div className="w-full rounded-t-sm" style={{
            height: `${Math.max((d.count / max) * 96, d.count > 0 ? 4 : 2)}px`,
            backgroundColor: d.count > 0 ? '#DC5B17' : 'var(--adm-border)',
          }} />
          <span className="text-[10px] text-center" style={{ color: 'var(--adm-muted)' }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export function WritingMetricsClient() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts/metrics')
      .then((r) => r.json())
      .then((d) => { if (!d.error) setMetrics(d); })
      .finally(() => setLoading(false));
  }, []);

  const topMax = metrics?.topPosts[0]?.views ?? 1;

  return (
    <SectionLayout
      title="Writing Metrics"
      subtitle="Track performance across your posts and articles"
      stats={[
        { label: 'Total Views',     value: loading ? '…' : (metrics?.totalViews ?? 0).toLocaleString() },
        { label: 'Published Posts', value: loading ? '…' : (metrics?.publishedPosts ?? 0) },
        { label: 'Drafts',          value: loading ? '…' : (metrics?.draftPosts ?? 0) },
        { label: 'Avg Views / Post', value: loading ? '…' : (metrics?.avgViews ?? 0).toLocaleString() },
      ]}
    >
      <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Posts published per month */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--adm-text)' }}>Posts Published</p>
          <p className="text-xs mb-4" style={{ color: 'var(--adm-muted)' }}>Last 6 months</p>
          {loading ? (
            <div className="h-32 flex items-center justify-center text-xs" style={{ color: 'var(--adm-muted)' }}>Loading…</div>
          ) : (
            <BarChart data={metrics?.monthlyData ?? []} />
          )}
        </div>

        {/* Top posts */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--adm-text)' }}>Top Posts by Views</p>
          {loading ? (
            <div className="text-xs" style={{ color: 'var(--adm-muted)' }}>Loading…</div>
          ) : !metrics?.topPosts.length ? (
            <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>No data yet</p>
          ) : (
            <div className="flex flex-col gap-4">
              {metrics.topPosts.map((p) => (
                <div key={p.id}>
                  <p className="text-xs font-medium truncate mb-1.5" style={{ color: 'var(--adm-text)' }}>{p.title}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-white/5">
                      <div className="h-1.5 rounded-full bg-[#DC5B17]"
                        style={{ width: `${topMax > 0 ? (p.views / topMax) * 100 : 0}%` }} />
                    </div>
                    <span className="text-xs shrink-0" style={{ color: 'var(--adm-muted)' }}>
                      {p.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionLayout>
  );
}
