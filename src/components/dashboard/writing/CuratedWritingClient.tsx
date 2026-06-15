'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type CuratedLink = {
  id: string; url: string; title: string; description: string | null;
  image_url: string | null; source_name: string | null; author: string | null;
  position: number; click_count: number; added_at: string;
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
    fetch('/api/curated')
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
                  {draft.source_name && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: 'rgba(0,0,0,0.65)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      {draft.source_name}
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-base leading-snug" style={{ color: 'var(--adm-text)' }}>{draft.title}</h3>
                {draft.description && (
                  <p className="text-sm mt-1.5 line-clamp-2 leading-relaxed" style={{ color: 'var(--adm-muted)' }}>{draft.description}</p>
                )}
                {draft.source_name && (
                  <p className="text-xs mt-2 font-medium" style={{ color: '#DC5B17' }}>
                    Read on {draft.source_name} →
                  </p>
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
          <div className="flex flex-col gap-3">
            {[1,2,3].map((i) => (
              <div key={i} className="h-28 rounded-2xl border animate-pulse"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }} />
            ))}
          </div>
        ) : links.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 rounded-2xl border"
            style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <svg className="mb-3" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"
              viewBox="0 0 24 24" style={{ color: 'var(--adm-border)' }}>
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            <p className="text-sm font-medium" style={{ color: 'var(--adm-text)' }}>No curated posts yet</p>
            <p className="text-xs mt-1" style={{ color: 'var(--adm-muted)' }}>Paste a URL on the left to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {links.map((link, i) => (
              <div key={link.id} className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>

                {/* Banner image — full width, 16:9-ish */}
                {link.image_url ? (
                  <div className="relative w-full h-36 overflow-hidden bg-white/5">
                    <Image src={link.image_url} alt="" fill className="object-cover" unoptimized />
                    {/* Source badge over image */}
                    {link.source_name && (
                      <div className="absolute bottom-2 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold"
                        style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                        <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        {link.source_name}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-20 flex items-center justify-center bg-white/[0.03]">
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.2"
                      viewBox="0 0 24 24" style={{ color: 'var(--adm-border)' }}>
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                  </div>
                )}

                {/* Content + actions row */}
                <div className="flex items-start gap-3 p-3">
                  <div className="flex-1 min-w-0">
                    {link.source_name && !link.image_url && (
                      <p className="text-[11px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#DC5B17' }}>
                        {link.source_name}
                      </p>
                    )}
                    <p className="text-sm font-semibold line-clamp-2 leading-snug" style={{ color: 'var(--adm-text)' }}>
                      {link.title}
                    </p>
                    {link.description && (
                      <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--adm-muted)' }}>{link.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    <div className="text-center mr-1">
                      <p className="text-sm font-bold leading-none"
                        style={{ color: (link.click_count ?? 0) > 0 ? '#DC5B17' : 'var(--adm-border)' }}>
                        {link.click_count ?? 0}
                      </p>
                      <p className="text-[9px]" style={{ color: 'var(--adm-muted)' }}>clicks</p>
                    </div>
                    <button onClick={() => move(link.id, 'up')} disabled={i === 0}
                      className="p-1.5 rounded-lg disabled:opacity-20"
                      style={{ color: 'var(--adm-muted)', backgroundColor: 'var(--adm-bg)' }}>
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>
                    </button>
                    <button onClick={() => move(link.id, 'down')} disabled={i === links.length - 1}
                      className="p-1.5 rounded-lg disabled:opacity-20"
                      style={{ color: 'var(--adm-muted)', backgroundColor: 'var(--adm-bg)' }}>
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <button onClick={() => handleRemove(link.id)}
                      className="p-1.5 rounded-lg"
                      style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)' }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
