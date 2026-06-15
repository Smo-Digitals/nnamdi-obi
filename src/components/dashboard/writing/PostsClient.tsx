'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, PencilSimple, Trash, Star } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Status = 'published' | 'draft' | 'archived' | 'scheduled';
type Post = {
  id: string; title: string; category: string | null; status: Status;
  views: number | null; featured: boolean | null; created_at: string;
};

const S: Record<string, string> = {
  published: 'text-green-400 bg-green-400/10 border-green-400/20',
  draft:     'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  archived:  'text-[#555] bg-white/5 border-white/10',
  scheduled: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
};

export function PostsClient() {
  const router = useRouter();
  const [posts,   setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setPosts(d); })
      .finally(() => setLoading(false));
  }, []);

  async function toggleFeatured(post: Post) {
    const next = !post.featured;
    setPosts((ps) => ps.map((p) => ({
      ...p,
      featured: p.id === post.id ? next : (next ? false : p.featured),
    })));
    await fetch(`/api/posts/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: next }),
    });
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    setPosts((ps) => ps.filter((p) => p.id !== id));
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  }

  const visible = posts
    .filter((p) => filter === 'all' || p.status === filter)
    .filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { label: 'Total',        value: posts.length },
    { label: 'Published',    value: posts.filter((p) => p.status === 'published').length },
    { label: 'Drafts',       value: posts.filter((p) => p.status === 'draft').length },
    { label: 'Total Views',  value: posts.reduce((s, p) => s + (p.views ?? 0), 0).toLocaleString() },
  ];

  return (
    <SectionLayout
      title="Posts"
      subtitle="Manage your blog posts and articles"
      cta={{ label: 'New Post', onClick: () => router.push('/admin/writing/create') }}
      stats={stats}
      filters={['all', 'published', 'draft', 'archived']}
      active={filter}
      onFilter={setFilter}
    >
      <div className="mb-4">
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts…"
          className="w-full max-w-xs px-3 py-2 text-sm rounded-xl border outline-none"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }}
        />
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        {loading ? (
          <div className="py-20 text-center text-sm" style={{ color: 'var(--adm-muted)' }}>Loading posts…</div>
        ) : visible.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--adm-muted)' }}>
              {posts.length === 0 ? 'No posts yet' : 'No posts match this filter'}
            </p>
            {posts.length === 0 && (
              <button onClick={() => router.push('/admin/writing/create')}
                className="mt-4 px-5 py-2 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold">
                Write your first post
              </button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
                {['Title', 'Category', 'Status', 'Views', 'Date', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((p, i) => (
                <tr key={p.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                  <td className="px-4 py-3.5 max-w-xs">
                    <div className="flex items-center gap-2">
                      {p.featured && (
                        <Star size={11} weight="fill" className="text-yellow-400 shrink-0" />
                      )}
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--adm-text)' }}>{p.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{p.category || '—'}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${S[p.status] ?? S.draft}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>
                    {(p.views ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>
                    {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => toggleFeatured(p)}
                        title={p.featured ? 'Remove featured' : 'Set as featured post'}
                        className="p-1.5 rounded-lg transition-colors hover:bg-yellow-400/10"
                        style={{ color: p.featured ? '#eab308' : 'var(--adm-muted)' }}>
                        <Star size={14} weight={p.featured ? 'fill' : 'regular'} />
                      </button>
                      <Link href={`/admin/writing/create?id=${p.id}`}
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title="Edit"
                        style={{ color: 'var(--adm-muted)' }}>
                        <PencilSimple size={14} />
                      </Link>
                      <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title="View"
                        style={{ color: 'var(--adm-muted)' }}>
                        <Eye size={14} />
                      </button>
                      <button onClick={() => deletePost(p.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" title="Delete"
                        style={{ color: 'var(--adm-muted)' }}>
                        <Trash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SectionLayout>
  );
}
