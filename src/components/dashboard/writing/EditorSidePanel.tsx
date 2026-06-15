'use client';

import { useEffect, useState } from 'react';
import { X, Trash } from 'phosphor-react';

type Post = { id: string; title: string; status: string; created_at: string };
type EditorDetail = {
  profile: { id: string; full_name: string; email: string; avatar_url: string | null; created_at: string; role: string };
  posts: Post[];
};

interface Props {
  editorId: string;
  onClose: () => void;
  onRemove: (id: string) => void;
}

export function EditorSidePanel({ editorId, onClose, onRemove }: Props) {
  const [data, setData] = useState<EditorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/editors/${editorId}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [editorId]);

  const initials = data?.profile.full_name
    ? data.profile.full_name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative w-96 h-full flex flex-col border-l overflow-y-auto z-10"
        style={{ backgroundColor: 'var(--adm-sidebar)', borderColor: 'var(--adm-border)' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b shrink-0"
          style={{ borderColor: 'var(--adm-border)' }}>
          <h2 className="text-sm font-bold" style={{ color: 'var(--adm-text)' }}>Editor Profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: 'var(--adm-muted)' }}>
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 p-5 flex flex-col gap-4">
            {[80, 40, 60, 40, 40].map((w, i) => (
              <div key={i} className="h-3 rounded-full animate-pulse" style={{ width: `${w}%`, backgroundColor: 'var(--adm-card)' }} />
            ))}
          </div>
        ) : data ? (
          <div className="flex-1 p-5 flex flex-col gap-6">
            {/* Avatar + basic info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-lg font-bold text-white"
                style={{ backgroundColor: '#DC5B17' }}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-base leading-tight" style={{ color: 'var(--adm-text)' }}>
                  {data.profile.full_name || '—'}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--adm-muted)' }}>{data.profile.email}</p>
                <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border text-blue-400 bg-blue-400/10 border-blue-400/20 uppercase">
                  editor
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border p-3" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
                <p className="text-xl font-bold" style={{ color: 'var(--adm-text)' }}>{data.posts.length}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--adm-muted)' }}>Posts written</p>
              </div>
              <div className="rounded-xl border p-3" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
                <p className="text-xs font-medium" style={{ color: 'var(--adm-text)' }}>
                  {new Date(data.profile.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--adm-muted)' }}>Joined</p>
              </div>
            </div>

            {/* Activity log */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--adm-muted)' }}>
                Recent Activity
              </p>
              {data.posts.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>No posts yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {data.posts.map((p) => (
                    <div key={p.id} className="rounded-xl border p-3"
                      style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
                      <p className="text-xs font-medium line-clamp-1" style={{ color: 'var(--adm-text)' }}>{p.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                          p.status === 'published' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'
                        }`}>{p.status}</span>
                        <span className="text-[10px]" style={{ color: 'var(--adm-muted)' }}>
                          {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Remove */}
            <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--adm-border)' }}>
              <button
                onClick={() => { if (confirm('Remove editor access?')) onRemove(editorId); }}
                className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors">
                <Trash size={13} /> Remove editor access
              </button>
            </div>
          </div>
        ) : (
          <p className="p-5 text-sm" style={{ color: 'var(--adm-muted)' }}>Failed to load editor.</p>
        )}
      </aside>
    </div>
  );
}
