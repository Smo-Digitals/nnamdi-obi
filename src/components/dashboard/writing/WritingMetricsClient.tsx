'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type PostRow = {
  id: string;
  title: string;
  cover_image_url: string | null;
  status: string;
  views: number;
  likes: number;
  comment_count: number;
  read_time_minutes: number | null;
  created_at: string;
};

type Metrics = {
  totalViews:     number;
  totalLikes:     number;
  totalComments:  number;
  avgReadSeconds: number;
  totalPosts:     number;
  posts:          PostRow[];
};

type SortKey = 'views' | 'likes' | 'comment_count' | 'read_time_minutes';
type SortDir = 'asc' | 'desc';

function formatReadTime(minutes: number | null): string {
  if (!minutes) return '—';
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  if (m === 0) return `${s}s`;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatAvgReadTime(seconds: number): string {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

const STATUS_STYLE: Record<string, string> = {
  published: 'text-green-400 bg-green-400/10',
  draft:     'text-yellow-400 bg-yellow-400/10',
  archived:  'text-[#555] bg-white/5',
  scheduled: 'text-blue-400 bg-blue-400/10',
};

function StatCard({ icon, value, label, iconBg }: { icon: React.ReactNode; value: string; label: string; iconBg: string }) {
  return (
    <div className="rounded-2xl border p-6 flex flex-col gap-4"
      style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold" style={{ color: 'var(--adm-text)' }}>{value}</p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--adm-muted)' }}>{label}</p>
      </div>
    </div>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
      style={{ opacity: active ? 1 : 0.3 }}>
      {dir === 'desc' || !active
        ? <path d="M5 7L1 3h8L5 7z" fill="currentColor" />
        : <path d="M5 3l4 4H1L5 3z" fill="currentColor" />}
    </svg>
  );
}

export function WritingMetricsClient() {
  const [metrics,  setMetrics]  = useState<Metrics | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [sortKey,  setSortKey]  = useState<SortKey>('views');
  const [sortDir,  setSortDir]  = useState<SortDir>('desc');

  useEffect(() => {
    fetch('/api/posts/metrics')
      .then((r) => r.json())
      .then((d) => { if (!d.error) setMetrics(d); })
      .finally(() => setLoading(false));
  }, []);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const rows = metrics ? [...metrics.posts].sort((a, b) => {
    const av = a[sortKey] ?? 0;
    const bv = b[sortKey] ?? 0;
    return sortDir === 'desc' ? (bv as number) - (av as number) : (av as number) - (bv as number);
  }) : [];

  const totalPosts = metrics?.totalPosts ?? 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--adm-text)' }}>Post Metrics</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--adm-muted)' }}>
          {loading ? '…' : `${totalPosts} post${totalPosts !== 1 ? 's' : ''} · performance overview`}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          iconBg="rgba(20,184,166,0.15)"
          icon={
            <svg width="18" height="18" fill="none" stroke="#14b8a6" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          }
          value={loading ? '…' : (metrics?.totalViews ?? 0).toLocaleString()}
          label="Total Views"
        />
        <StatCard
          iconBg="rgba(244,63,94,0.15)"
          icon={
            <svg width="18" height="18" fill="#f43f5e" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          }
          value={loading ? '…' : (metrics?.totalLikes ?? 0).toLocaleString()}
          label="Total Likes"
        />
        <StatCard
          iconBg="rgba(34,197,94,0.15)"
          icon={
            <svg width="18" height="18" fill="none" stroke="#22c55e" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          }
          value={loading ? '…' : (metrics?.totalComments ?? 0).toLocaleString()}
          label="Comments"
        />
        <StatCard
          iconBg="rgba(99,102,241,0.15)"
          icon={
            <svg width="18" height="18" fill="none" stroke="#6366f1" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          }
          value={loading ? '…' : formatAvgReadTime(metrics?.avgReadSeconds ?? 0)}
          label="Avg. Read Time"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              <th className="text-left px-5 py-3.5 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>POST</th>
              {([
                { key: 'views',             label: 'Views' },
                { key: 'likes',             label: 'Likes' },
                { key: 'comment_count',     label: 'Cmts' },
                { key: 'read_time_minutes', label: 'Avg read' },
              ] as { key: SortKey; label: string }[]).map((col) => (
                <th key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="px-4 py-3.5 text-xs font-semibold cursor-pointer select-none"
                  style={{ color: 'var(--adm-muted)' }}>
                  <div className="flex items-center gap-1.5 justify-end">
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortKey === col.key ? sortDir : 'desc'} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3.5 text-xs font-semibold text-right" style={{ color: 'var(--adm-muted)' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-20 text-center text-sm" style={{ color: 'var(--adm-muted)' }}>
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center text-sm" style={{ color: 'var(--adm-muted)' }}>
                  No posts yet
                </td>
              </tr>
            ) : rows.map((p, i) => (
              <tr key={p.id}
                style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                {/* Post */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg shrink-0 overflow-hidden bg-white/5 flex items-center justify-center">
                      {p.cover_image_url ? (
                        <Image src={p.cover_image_url} alt="" width={40} height={40} className="w-full h-full object-cover" unoptimized />
                      ) : (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--adm-border)' }}>
                          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9l5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="8.5" r="1.5"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium max-w-xs truncate" style={{ color: 'var(--adm-text)' }}>{p.title}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-0.5 inline-block ${STATUS_STYLE[p.status] ?? STATUS_STYLE.draft}`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </td>
                {/* Views */}
                <td className="px-4 py-3.5 text-sm text-right font-medium" style={{ color: 'var(--adm-text)' }}>
                  {(p.views ?? 0).toLocaleString()}
                </td>
                {/* Likes */}
                <td className="px-4 py-3.5 text-right">
                  <span className="flex items-center gap-1 justify-end text-sm" style={{ color: 'var(--adm-text)' }}>
                    <svg width="12" height="12" fill="#f43f5e" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {p.likes ?? 0}
                  </span>
                </td>
                {/* Comments */}
                <td className="px-4 py-3.5 text-sm text-right" style={{ color: 'var(--adm-text)' }}>
                  {p.comment_count ?? 0}
                </td>
                {/* Avg read */}
                <td className="px-4 py-3.5 text-sm text-right" style={{ color: 'var(--adm-muted)' }}>
                  {formatReadTime(p.read_time_minutes)}
                </td>
                {/* Date */}
                <td className="px-4 py-3.5 text-xs text-right whitespace-nowrap" style={{ color: 'var(--adm-muted)' }}>
                  {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
