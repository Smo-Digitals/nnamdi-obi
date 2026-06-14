'use client';

import { useState } from 'react';
import { Check, Warning, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type CommentStatus = 'pending' | 'approved' | 'spam';
type Comment = { id: string; author: string; content: string; post: string; date: string; status: CommentStatus; };

const MOCK: Comment[] = [
  { id: '1', author: 'Tunde Afolabi', content: 'This was incredibly insightful! Really changed my perspective on community building.', post: 'How to build a successful community online', date: '2026-06-13', status: 'pending' },
  { id: '2', author: 'Amaka Obi', content: 'Great article. Would love to see more content on this topic.', post: 'The complete guide to online courses', date: '2026-06-12', status: 'approved' },
  { id: '3', author: 'spam-bot-42', content: 'Click here for free money! Visit my site for exclusive deals...', post: 'Building in public: lessons from year one', date: '2026-06-11', status: 'spam' },
  { id: '4', author: 'Chike Eze', content: 'Exactly what I needed to read today. Bookmarked this.', post: 'Why every creator needs an email list', date: '2026-06-10', status: 'pending' },
  { id: '5', author: 'Fatima Bello', content: 'The creator economy is booming and this post proves it.', post: 'The creator economy in 2026', date: '2026-06-09', status: 'approved' },
];

const S: Record<CommentStatus, string> = {
  pending:  'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  approved: 'text-green-400 bg-green-400/10 border-green-400/20',
  spam:     'text-red-400 bg-red-400/10 border-red-400/20',
};

export function CommentsClient() {
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? MOCK : MOCK.filter((c) => c.status === filter);

  return (
    <SectionLayout
      title="Comments"
      subtitle="Moderate reader comments across all posts"
      stats={[
        { label: 'Total', value: MOCK.length },
        { label: 'Pending', value: MOCK.filter((c) => c.status === 'pending').length },
        { label: 'Approved', value: MOCK.filter((c) => c.status === 'approved').length },
        { label: 'Spam', value: MOCK.filter((c) => c.status === 'spam').length },
      ]}
      filters={['all', 'pending', 'approved', 'spam']}
      active={filter}
      onFilter={setFilter}
    >
      <div className="flex flex-col gap-3">
        {rows.map((c) => (
          <div key={c.id} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{c.author}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${S[c.status]}`}>{c.status}</span>
                  <span className="text-xs" style={{ color: 'var(--adm-muted)' }}>
                    {new Date(c.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <p className="text-sm mb-2" style={{ color: 'var(--adm-text)' }}>{c.content}</p>
                <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>On: <span className="italic">{c.post}</span></p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button className="p-1.5 rounded-lg hover:bg-green-500/10 hover:text-green-400 transition-colors" style={{ color: 'var(--adm-muted)' }}><Check size={14} /></button>
                <button className="p-1.5 rounded-lg hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors" style={{ color: 'var(--adm-muted)' }}><Warning size={14} /></button>
                <button className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}><Trash size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
