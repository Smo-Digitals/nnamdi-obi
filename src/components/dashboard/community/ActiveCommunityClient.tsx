'use client';

import { useState } from 'react';
import { ChatCircle, Eye, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Thread = { id: string; title: string; author: string; category: string; replies: number; views: number; date: string; pinned: boolean; };

const MOCK: Thread[] = [
  { id: '1', title: 'How do you manage time as a full-time creator?', author: 'Tunde Afolabi', category: 'Productivity', replies: 24, views: 340, date: '2026-06-13', pinned: true },
  { id: '2', title: 'Share your biggest lesson from building online', author: 'Amaka Obi', category: 'Personal', replies: 41, views: 520, date: '2026-06-12', pinned: false },
  { id: '3', title: 'What tools do you use for email marketing?', author: 'Chike Eze', category: 'Marketing', replies: 18, views: 210, date: '2026-06-11', pinned: false },
  { id: '4', title: 'Looking for accountability partners — who is in?', author: 'Fatima Bello', category: 'Community', replies: 32, views: 280, date: '2026-06-10', pinned: false },
  { id: '5', title: 'Review my course landing page — feedback welcome', author: 'David Nwosu', category: 'Courses', replies: 9, views: 95, date: '2026-06-09', pinned: false },
];

export function ActiveCommunityClient() {
  const [filter, setFilter] = useState('all');
  const categories = ['all', ...Array.from(new Set(MOCK.map((t) => t.category.toLowerCase())))];
  const rows = filter === 'all' ? MOCK : MOCK.filter((t) => t.category.toLowerCase() === filter);

  return (
    <SectionLayout
      title="Active Discussions"
      subtitle="Community threads and conversations"
      stats={[
        { label: 'Total Threads', value: MOCK.length },
        { label: 'Total Replies', value: MOCK.reduce((s, t) => s + t.replies, 0) },
        { label: 'Total Views', value: MOCK.reduce((s, t) => s + t.views, 0).toLocaleString() },
      ]}
      filters={categories}
      active={filter}
      onFilter={setFilter}
    >
      <div className="flex flex-col gap-3">
        {rows.map((t) => (
          <div key={t.id} className="rounded-2xl border p-5 flex items-start gap-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <div className="p-2.5 rounded-xl bg-white/5 mt-0.5 shrink-0" style={{ color: 'var(--adm-muted)' }}>
              <ChatCircle size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--adm-text)' }}>{t.title}</p>
              <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>
                by {t.author} · {t.category} · {t.replies} replies · {t.views} views ·{' '}
                {new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><Eye size={14} /></button>
              <button className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}><Trash size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
