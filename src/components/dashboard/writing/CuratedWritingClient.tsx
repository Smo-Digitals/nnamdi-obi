'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type CuratedLink = {
  id: string; url: string; title: string; description: string | null;
  image_url: string | null; source_name: string | null; author: string | null;
  position: number; click_count: number; active: boolean; added_at: string;
};

type Draft = {
  url: string; title: string; description: string;
  image_url: string; source_name: string; author: string;
};

export function CuratedWritingClient() {
  const [links,      setLinks]      = useState<CuratedLink[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [urlInput,   setUrlInput]   = useState('');
  const [fetching,   setFetching]   = useState(false);
  const [draft,      setDraft]      = useState<Draft | null>(null);
  const [fetchErr,   setFetchErr]   = useState('');
  const [saving,     setSaving]     = useState(false);

  useEffect(() => {
    fetch('/api/curated?all=1')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setLinks(d); })
      .finally(() => setLoading(false));
  }, []);

  async function handleFetch() {
    if (!urlInput.trim()) return;
    setFetching(true); setFetchErr(''); setDraft(null);
    try {
      const r = await fetch(`/api/curated/extract?url=${encodeURIComponent(urlInput.trim())}`);
      const d = await r.json();
      if (d.error) setFetchErr(d.error);
      else setDraft(d);
    } finally { setFetching(false); }
  }

  async function handleSave() {
    if (!draft) return;
    setSaving(true);
    const r = await fetch('/api/curated', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    const d = await r.json();
    if (!d.error) { setLinks((prev) => [...prev, d]); setDraft(null); setUrlInput(''); }
    setSaving(false);
  }

  function handleCancel() { setDraft(null); setUrlInput(''); setFetchErr(''); }

  async function toggleActive(id: string, active: boolean) {
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, active } : l));
    await fetch(`/api/curated/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
  }

  async function handleRemove(id: string) {
    if (!confirm('Remove this link?')) return;
    setLinks((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/curated/${id}`, { method: 'DELETE' });
  }

  async function move(id: string, dir: 'up' | 'down') {
    const idx = links.findIndex((l) => l.id === id);
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === links.length - 1)) return;
    const next = [...links];
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setLinks(next.map((l, i) => ({ ...l, position: i })));
    await Promise.all([
      fetch(`/api/curated/${next[idx].id}`,  { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ position: idx }) }),
      fetch(`/api/curated/${next[swap].id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ position: swap }) }),
    ]);
  }

  const totalClicks = links.reduce((s, l) => s + (l.click_count ?? 0), 0);

  return (
    <div className="flex h-full min-h-screen" style={{ borderColor: 'var(--adm-border)' }}>

      {/* ══════════ LEFT HALF ══════════ */}
      <div className="w-1/2 p-8 flex flex-col gap-6 overflow-y-auto border-r" style={{ borderColor: 'var(--adm-border)' }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--adm-text)' }}>Curated Links</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--adm-muted)' }}>
            Paste any article URL — we'll pull the metadata automatically.
          </p>
        </div>

        {/* URL bar */}
        <div>
          <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--adm-muted)' }}>
            Add New Source
          </p>
          <div className="flex gap-2">
            <input
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setFetchErr(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              placeholder="https://example.com/blog/article-title"
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border outline-none"
              style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }}
            />
            <button onClick={handleFetch} disabled={!urlInput.trim() || fetching}
              className="px-5 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-40 whitespace-nowrap">
              {fetching ? 'Fetching…' : 'Fetch →'}
            </button>
          </div>
          {fetchErr && (
            <p className="mt-2 text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{fetchErr}</p>
          )}
        </div>

        {/* Preview & edit */}
        {draft && (
          <div className="flex flex-col gap-5">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--adm-muted)' }}>
              Preview &amp; Edit
            </p>

            {/* Preview card */}
            <div className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
              {draft.image_url && (
                <div className="relative w-full h-48 bg-white/5 overflow-hidden">
                  <Image src={draft.image_url} alt="" fill className="object-cover" unoptimized />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {draft.source_name && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                      style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-bg)' }}>
                      {draft.source_name}
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-green-400 bg-green-400/10">
                    Live
                  </span>
                </div>
                <h3 className="font-bold text-base leading-snug" style={{ color: 'var(--adm-text)' }}>{draft.title}</h3>
                {draft.description && (
                  <p className="text-sm mt-1.5 line-clamp-2 leading-relaxed" style={{ color: 'var(--adm-muted)' }}>{draft.description}</p>
                )}
              </div>
            </div>

            {/* Editable fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>Title</label>
                <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="px-3 py-2 text-sm rounded-xl border outline-none"
                  style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>Source Name</label>
                <input value={draft.source_name} onChange={(e) => setDraft({ ...draft, source_name: e.target.value })}
                  className="px-3 py-2 text-sm rounded-xl border outline-none"
                  style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>Excerpt</label>
              <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                rows={3} className="px-3 py-2 text-sm rounded-xl border outline-none resize-none"
                style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>Cover Image URL</label>
              <input value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
                className="px-3 py-2 text-sm rounded-xl border outline-none font-mono text-xs"
                style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-muted)' }} />
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving || !draft.title.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-40">
                {saving ? 'Saving…' : 'Save to Curated'}
              </button>
              <button onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl border text-sm transition-colors hover:bg-white/5"
                style={{ borderColor: 'var(--adm-border)', color: 'var(--adm-muted)' }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══════════ RIGHT HALF ══════════ */}
      <div className="w-1/2 p-8 flex flex-col gap-5 overflow-y-auto">
        {/* Header + mini stats */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--adm-text)' }}>
              Curated list
              {!loading && <span className="font-normal ml-1.5 text-sm" style={{ color: 'var(--adm-muted)' }}>({links.length})</span>}
            </h2>
            {!loading && links.length > 0 && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--adm-muted)' }}>{totalClicks} total clicks</p>
            )}
          </div>
          {!loading && links.length > 1 && (
            <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>↑↓ to reorder</p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex gap-4 py-4 border-b animate-pulse" style={{ borderColor: 'var(--adm-border)' }}>
                <div className="w-24 h-16 rounded-xl shrink-0" style={{ backgroundColor: 'var(--adm-card)' }} />
                <div className="flex-1 flex flex-col gap-2 pt-1">
                  <div className="h-3 w-24 rounded-full" style={{ backgroundColor: 'var(--adm-card)' }} />
                  <div className="h-4 w-3/4 rounded-full" style={{ backgroundColor: 'var(--adm-card)' }} />
                  <div className="h-3 w-1/2 rounded-full" style={{ backgroundColor: 'var(--adm-card)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : links.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm font-medium" style={{ color: 'var(--adm-text)' }}>No curated posts yet</p>
            <p className="text-xs mt-1" style={{ color: 'var(--adm-muted)' }}>Paste a URL on the left to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {links.map((link) => {
              let hostname = '';
              try { hostname = new URL(link.url).hostname.replace('www.', ''); } catch { hostname = link.url; }
              return (
                <div key={link.id}
                  className="flex items-start gap-4 py-4 border-b"
                  style={{ borderColor: 'var(--adm-border)', opacity: link.active ? 1 : 0.45 }}>

                  {/* Thumbnail */}
                  <div className="w-24 h-16 rounded-xl shrink-0 overflow-hidden bg-white/5 flex items-center justify-center">
                    {link.image_url ? (
                      <Image src={link.image_url} alt="" width={96} height={64}
                        className="w-full h-full object-cover" unoptimized />
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"
                        viewBox="0 0 24 24" style={{ color: 'var(--adm-border)' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <path d="M3 9l5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="8.5" r="1.5"/>
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {link.source_name && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                          style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-bg)' }}>
                          {link.source_name}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${link.active ? 'text-green-400 bg-green-400/10' : 'text-[#555] bg-white/5'}`}>
                        {link.active ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold leading-snug line-clamp-1" style={{ color: 'var(--adm-text)' }}>
                      {link.title}
                    </p>
                    {link.description && (
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--adm-muted)' }}>{link.description}</p>
                    )}
                    <p className="text-[11px] mt-1 truncate" style={{ color: 'var(--adm-border)' }}>{hostname}</p>
                  </div>

                  {/* Right: date + actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs" style={{ color: 'var(--adm-muted)' }}>
                      {new Date(link.added_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => toggleActive(link.id, !link.active)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                      style={{ backgroundColor: 'var(--adm-bg)', color: 'var(--adm-muted)', border: '1px solid var(--adm-border)' }}>
                      {link.active ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => handleRemove(link.id)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10 hover:text-red-400"
                      style={{ color: 'var(--adm-muted)' }}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
