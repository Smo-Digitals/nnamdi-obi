'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type CuratedLink = {
  id: string; url: string; title: string; description: string | null;
  image_url: string | null; source_name: string | null; author: string | null;
  position: number; click_count: number; added_at: string;
};

type Preview = {
  url: string; title: string; description: string;
  image_url: string; source_name: string; author: string;
};

export function CuratedWritingClient() {
  const [links,      setLinks]      = useState<CuratedLink[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [urlInput,   setUrlInput]   = useState('');
  const [extracting, setExtracting] = useState(false);
  const [preview,    setPreview]    = useState<Preview | null>(null);
  const [extractErr, setExtractErr] = useState('');
  const [saving,     setSaving]     = useState(false);

  useEffect(() => {
    fetch('/api/curated')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setLinks(d); })
      .finally(() => setLoading(false));
  }, []);

  async function handleExtract() {
    if (!urlInput.trim()) return;
    setExtracting(true); setExtractErr(''); setPreview(null);
    try {
      const r = await fetch(`/api/curated/extract?url=${encodeURIComponent(urlInput.trim())}`);
      const d = await r.json();
      if (d.error) setExtractErr(d.error);
      else setPreview(d);
    } finally { setExtracting(false); }
  }

  async function handleSave() {
    if (!preview) return;
    setSaving(true);
    const r = await fetch('/api/curated', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preview),
    });
    const d = await r.json();
    if (!d.error) { setLinks((prev) => [...prev, d]); setPreview(null); setUrlInput(''); }
    setSaving(false);
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
  const topLink     = [...links].sort((a, b) => (b.click_count ?? 0) - (a.click_count ?? 0))[0];

  return (
    <div className="p-8 flex gap-6 items-start min-h-screen">

      {/* ── Left: form + stats (fixed width, narrow) ── */}
      <div className="w-56 shrink-0 sticky top-8 flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--adm-text)' }}>Curated Reads</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--adm-muted)' }}>Add external posts by URL</p>
        </div>

        {/* URL input card */}
        <div className="rounded-2xl border p-4 flex flex-col gap-2"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-xs font-semibold" style={{ color: 'var(--adm-text)' }}>Add a post</p>
          <input
            value={urlInput}
            onChange={(e) => { setUrlInput(e.target.value); setExtractErr(''); setPreview(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
            placeholder="Paste article URL…"
            className="w-full px-3 py-2 text-xs rounded-xl border outline-none"
            style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }}
          />
          <button onClick={handleExtract} disabled={!urlInput.trim() || extracting}
            className="w-full py-2 rounded-xl bg-[#DC5B17] text-white text-xs font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-40">
            {extracting ? 'Extracting…' : 'Extract'}
          </button>
          {extractErr && (
            <p className="text-[11px] text-red-400 bg-red-400/10 rounded-lg px-2 py-1.5">{extractErr}</p>
          )}
        </div>

        {/* Preview */}
        {preview && (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#DC5B17', backgroundColor: 'var(--adm-card)' }}>
            {preview.image_url && (
              <div className="w-full h-24 overflow-hidden bg-white/5">
                <Image src={preview.image_url} alt="" width={224} height={96}
                  className="w-full h-full object-cover" unoptimized />
              </div>
            )}
            <div className="p-3">
              <p className="text-xs font-semibold line-clamp-2" style={{ color: 'var(--adm-text)' }}>{preview.title}</p>
              {preview.source_name && (
                <p className="text-[11px] mt-0.5" style={{ color: '#DC5B17' }}>{preview.source_name}</p>
              )}
              {preview.description && (
                <p className="text-[11px] mt-1 line-clamp-2" style={{ color: 'var(--adm-muted)' }}>{preview.description}</p>
              )}
            </div>
            <div className="flex gap-2 px-3 pb-3">
              <button onClick={() => { setPreview(null); setUrlInput(''); }}
                className="flex-1 py-1.5 text-xs rounded-lg border hover:bg-white/5 transition-colors"
                style={{ borderColor: 'var(--adm-border)', color: 'var(--adm-muted)' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-1.5 text-xs rounded-lg bg-[#DC5B17] text-white font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-40">
                {saving ? '…' : 'Add'}
              </button>
            </div>
          </div>
        )}

        {/* Metrics */}
        {!loading && links.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--adm-muted)' }}>Metrics</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Links',        value: links.length,          accent: false },
                { label: 'Total clicks', value: totalClicks,           accent: true  },
                { label: 'Avg clicks',   value: links.length > 0 ? Math.round(totalClicks / links.length) : 0, accent: false },
                { label: 'Top clicks',   value: topLink?.click_count ?? 0, accent: true },
              ].map(({ label, value, accent }) => (
                <div key={label} className="rounded-xl border p-2.5"
                  style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)' }}>
                  <p className="text-lg font-bold leading-none" style={{ color: accent ? '#DC5B17' : 'var(--adm-text)' }}>{value}</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--adm-muted)' }}>{label}</p>
                </div>
              ))}
            </div>
            {topLink && (
              <div className="rounded-xl border p-3"
                style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)' }}>
                <p className="text-[9px] uppercase font-bold tracking-widest mb-1.5" style={{ color: 'var(--adm-muted)' }}>Most clicked</p>
                <p className="text-xs font-semibold line-clamp-2 leading-relaxed" style={{ color: 'var(--adm-text)' }}>{topLink.title}</p>
                {topLink.source_name && (
                  <p className="text-[11px] mt-1" style={{ color: '#DC5B17' }}>{topLink.source_name}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Right: curated list (takes all remaining space) ── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-5">
          <p className="text-base font-bold" style={{ color: 'var(--adm-text)' }}>
            Curated list{' '}
            {!loading && <span className="font-normal text-sm" style={{ color: 'var(--adm-muted)' }}>({links.length})</span>}
          </p>
          {!loading && links.length > 1 && (
            <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>Use ↑↓ arrows to reorder</p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl border animate-pulse"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }} />
            ))}
          </div>
        ) : links.length === 0 ? (
          <div className="rounded-2xl border py-20 text-center"
            style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <svg className="mx-auto mb-3" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"
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
                <div className="flex">
                  {/* Thumbnail */}
                  <div className="w-36 shrink-0 bg-white/5 flex items-center justify-center overflow-hidden self-stretch">
                    {link.image_url ? (
                      <Image src={link.image_url} alt="" width={144} height={128}
                        className="w-full h-full object-cover" unoptimized />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"
                          viewBox="0 0 24 24" style={{ color: 'var(--adm-border)' }}>
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 min-w-0 flex flex-col justify-between">
                    <div>
                      {link.source_name && (
                        <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#DC5B17' }}>
                          {link.source_name}
                        </p>
                      )}
                      <p className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: 'var(--adm-text)' }}>
                        {link.title}
                      </p>
                      {link.description && (
                        <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed" style={{ color: 'var(--adm-muted)' }}>
                          {link.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {link.author && (
                        <span className="text-[11px]" style={{ color: 'var(--adm-muted)' }}>By {link.author}</span>
                      )}
                      <a href={link.url} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] hover:underline truncate max-w-xs"
                        style={{ color: 'var(--adm-muted)' }}
                        onClick={(e) => e.stopPropagation()}>
                        {new URL(link.url).hostname.replace('www.', '')}
                      </a>
                    </div>
                  </div>

                  {/* Right: click count + actions */}
                  <div className="flex flex-col items-center justify-between py-3 px-4 shrink-0 border-l gap-3"
                    style={{ borderColor: 'var(--adm-border)' }}>
                    {/* Click count */}
                    <div className="flex flex-col items-center">
                      <p className="text-2xl font-bold leading-none"
                        style={{ color: (link.click_count ?? 0) > 0 ? '#DC5B17' : 'var(--adm-border)' }}>
                        {link.click_count ?? 0}
                      </p>
                      <p className="text-[10px] mt-1" style={{ color: 'var(--adm-muted)' }}>clicks</p>
                    </div>

                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => move(link.id, 'up')} disabled={i === 0}
                        className="p-1.5 rounded-lg transition-colors disabled:opacity-20"
                        style={{ color: 'var(--adm-muted)', backgroundColor: 'var(--adm-bg)' }}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>
                      </button>
                      <button onClick={() => move(link.id, 'down')} disabled={i === links.length - 1}
                        className="p-1.5 rounded-lg transition-colors disabled:opacity-20"
                        style={{ color: 'var(--adm-muted)', backgroundColor: 'var(--adm-bg)' }}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                      </button>
                    </div>

                    {/* Delete */}
                    <button onClick={() => handleRemove(link.id)}
                      className="p-2 rounded-xl transition-colors"
                      style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)' }}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
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
