'use client';

import { useState } from 'react';
import { Eye, PencilSimple, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Status = 'published' | 'draft' | 'archived';
type Post = { id: string; title: string; category: string; status: Status; views: number; date: string; };

const MOCK: Post[] = [
  { id: '1', title: 'How to build a successful community online', category: 'Community', status: 'published', views: 2840, date: '2026-06-10' },
  { id: '2', title: 'The complete guide to online courses', category: 'Courses', status: 'published', views: 1920, date: '2026-06-08' },
  { id: '3', title: 'Top 10 tools for remote work productivity', category: 'Productivity', status: 'draft', views: 0, date: '2026-06-12' },
  { id: '4', title: 'Building in public: lessons from year one', category: 'Personal', status: 'published', views: 4100, date: '2026-05-28' },
  { id: '5', title: 'Why every creator needs an email list', category: 'Marketing', status: 'draft', views: 0, date: '2026-06-13' },
  { id: '6', title: 'The creator economy in 2026', category: 'Industry', status: 'archived', views: 880, date: '2026-04-15' },
];

const S: Record<Status, string> = {
  published: 'text-green-400 bg-green-400/10 border-green-400/20',
  draft:     'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  archived:  'text-[#555] bg-white/5 border-white/10',
};

export function PostsClient() {
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? MOCK : MOCK.filter((p) => p.status === filter);

  return (
    <SectionLayout
      title="Posts"
      subtitle="Manage your blog posts and articles"
      cta={{ label: 'New Post', onClick: () => {} }}
      stats={[
        { label: 'Total', value: MOCK.length },
        { label: 'Published', value: MOCK.filter((p) => p.status === 'published').length },
        { label: 'Drafts', value: MOCK.filter((p) => p.status === 'draft').length },
        { label: 'Total Views', value: MOCK.reduce((s, p) => s + p.views, 0).toLocaleString() },
      ]}
      filters={['all', 'published', 'draft', 'archived']}
      active={filter}
      onFilter={setFilter}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Title', 'Category', 'Status', 'Views', 'Date', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr key={p.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 max-w-xs">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--adm-text)' }}>{p.title}</p>
                </td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{p.category}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${S[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{p.views.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>
                  {new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 justify-end">
                    <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><Eye size={14} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><PencilSimple size={14} /></button>
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
