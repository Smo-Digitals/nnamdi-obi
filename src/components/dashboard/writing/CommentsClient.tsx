'use client';

import { useState, useEffect } from 'react';
import { Check, Warning, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type CommentStatus = 'pending' | 'approved' | 'spam';

type Comment = {
  id: string;
  author_name: string;
  content: string;
  status: CommentStatus;
  created_at: string;
  posts: { title: string; slug: string } | null;
};

const S: Record<CommentStatus, string> = {
  pending:  'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  approved: 'text-green-400 bg-green-400/10 border-green-400/20',
  spam:     'text-red-400 bg-red-400/10 border-red-400/20',
};

export function CommentsClient() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/comments?status=${filter}`)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setComments(d); })
      .finally(() => setLoading(false));
  }, [filter]);

  async function setStatus(id: string, status: CommentStatus) {
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
    await fetch(`/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  async function remove(id: string) {
    if (!confirm('Delete this comment?')) return;
    setComments((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/comments/${id}`, { method: 'DELETE' });
  }

  const counts = {
    all:      comments.length,
    pending:  comments.filter((c) => c.status === 'pending').length,
    approved: comments.filter((c) => c.status === 'approved').length,
    spam:     comments.filter((c) => c.status === 'spam').length,
  };

  return (
    <SectionLayout
      title="Comments"
      subtitle="Moderate reader comments across all posts"
      stats={[
        { label: 'Total',    value: counts.all },
        { label: 'Pending',  value: counts.pending },
        { label: 'Approved', value: counts.approved },
        { label: 'Spam',     value: counts.spam },
      ]}
      filters={['all', 'pending', 'approved', 'spam']}
      active={filter}
      onFilter={setFilter}
    >
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border h-24 animate-pulse"
              style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }} />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border py-16 text-center"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm" style={{ color: 'var(--adm-muted)' }}>No comments yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <div key={c.id} className="rounded-2xl border p-5"
              style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{c.author_name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${S[c.status]}`}>
                      {c.status}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--adm-muted)' }}>
                      {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'var(--adm-text)' }}>{c.content}</p>
                  {c.posts && (
                    <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>
                      On: <span className="italic">{c.posts.title}</span>
                    </p>
                  )}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => setStatus(c.id, 'approved')}
                    disabled={c.status === 'approved'}
                    className="p-1.5 rounded-lg hover:bg-green-500/10 hover:text-green-400 transition-colors disabled:opacity-30"
                    style={{ color: 'var(--adm-muted)' }}
                    title="Approve">
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => setStatus(c.id, 'spam')}
                    disabled={c.status === 'spam'}
                    className="p-1.5 rounded-lg hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors disabled:opacity-30"
                    style={{ color: 'var(--adm-muted)' }}
                    title="Mark as spam">
                    <Warning size={14} />
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    style={{ color: 'var(--adm-muted)' }}
                    title="Delete">
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionLayout>
  );
}
