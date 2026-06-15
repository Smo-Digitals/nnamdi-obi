'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type CuratedLink = {
  id: string; url: string; title: string; description: string | null;
  image_url: string | null; source_name: string | null; author: string | null;
  position: number; added_at: string;
};

type Preview = {
  url: string; title: string; description: string;
  image_url: string; source_name: string; author: string;
};

export function CuratedWritingClient() {
  const [links,       setLinks]       = useState<CuratedLink[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [urlInput,    setUrlInput]    = useState('');
  const [extracting,  setExtracting]  = useState(false);
  const [preview,     setPreview]     = useState<Preview | null>(null);
  const [extractErr,  setExtractErr]  = useState('');
  const [saving,      setSaving]      = useState(false);

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
      if (d.error) { setExtractErr(d.error); }
      else setPreview(d);
    } finally { setExtracting(false); }
  }

  async function handleSave() {
    if (!preview) return;
    setSaving(true);
    const r = await fetch('/api/curated', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preview),
    });
    const d = await r.json();
    if (!d.error) {
      setLinks((prev) => [...prev, d]);
      setPreview(null); setUrlInput('');
    }
    setSaving(false);
  }

  async function handleRemove(id: string) {
    if (!confirm('Remove this link from curated?')) return;
    setLinks((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/curated/${id}`, { method: 'DELETE' });
  }

  async function move(id: string, dir: 'up' | 'down') {
    const idx = links.findIndex((l) => l.id === id);
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === links.length - 1)) return;
    const next = [...links];
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    const reordered = next.map((l, i) => ({ ...l, position: i }));
    setLinks(reordered);
    await Promise.all([
      fetch(`/api/curated/${next[idx].id}`,  { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ position: idx }) }),
      fetch(`/api/curated/${next[swap].id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ position: swap }) }),
    ]);
  }

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--adm-text)' }}>Curated Reads</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--adm-muted)' }}>
          Add external blog posts by URL — they'll appear in your blog's curated section.
        </p>
      </div>

      {/* URL extractor */}
      <div className="rounded-2xl border p-5 mb-8" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
        <p className="text-sm font-semibold mb-3" style={{ color: 'var(--adm-text)' }}>Add a post</p>
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => { setUrlInput(e.target.value); setExtractErr(''); setPreview(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
            placeholder="https://example.com/blog/post-title"
            className="flex-1 px-3 py-2.5 text-sm rounded-xl border outline-none"
            style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }}
          />
          <button
            onClick={handleExtract}
            disabled={!urlInput.trim() || extracting}
            className="px-4 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-40"
          >
            {extracting ? 'Extracting…' : 'Extract'}
          </button>
        </div>

        {extractErr && (
          <p className="mt-3 text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{extractErr}</p>
        )}

        {/* Preview card */}
        {preview && (
          <div className="mt-4 rounded-xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
            <div className="flex gap-4 p-4" style={{ backgroundColor: 'var(--adm-bg)' }}>
              {preview.image_url && (
                <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5">
                  <Image src={preview.image_url} alt="" width={96} height={64} className="w-full h-full object-cover" unoptimized />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--adm-text)' }}>{preview.title}</p>
                {preview.source_name && (
                  <p className="text-xs mt-0.5" style={{ color: '#DC5B17' }}>{preview.source_name}</p>
                )}
                {preview.description && (
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--adm-muted)' }}>{preview.description}</p>
                )}
                {preview.author && (
                  <p className="text-xs mt-1" style={{ color: 'var(--adm-muted)' }}>By {preview.author}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-2.5 border-t" style={{ borderColor: 'var(--adm-border)' }}>
              <button onClick={() => { setPreview(null); setUrlInput(''); }}
                className="px-3 py-1.5 text-xs rounded-lg border hover:bg-white/5 transition-colors"
                style={{ borderColor: 'var(--adm-border)', color: 'var(--adm-muted)' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-1.5 text-xs rounded-lg bg-[#DC5B17] text-white font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-40">
                {saving ? 'Saving…' : 'Add to Curated'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>
            Curated list {!loading && <span style={{ color: 'var(--adm-muted)' }}>({links.length})</span>}
          </p>
        </div>

        {loading ? (
          <p className="text-sm py-8 text-center" style={{ color: 'var(--adm-muted)' }}>Loading…</p>
        ) : links.length === 0 ? (
          <div className="rounded-2xl border py-12 text-center" style={{ borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-card)' }}>
            <p className="text-sm" style={{ color: 'var(--adm-muted)' }}>No curated posts yet. Paste a URL above to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {links.map((link, i) => (
              <div key={link.id} className="rounded-2xl border flex gap-3 overflow-hidden"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>

                {/* Thumbnail */}
                <div className="w-20 h-20 shrink-0 bg-white/5 flex items-center justify-center overflow-hidden">
                  {link.image_url ? (
                    <Image src={link.image_url} alt="" width={80} height={80} className="w-full h-full object-cover" unoptimized />
                  ) : (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--adm-border)' }}>
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 py-3 pr-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--adm-text)' }}>{link.title}</p>
                  {link.source_name && (
                    <p className="text-xs mt-0.5" style={{ color: '#DC5B17' }}>{link.source_name}</p>
                  )}
                  {link.description && (
                    <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--adm-muted)' }}>{link.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center justify-center gap-0.5 px-2 shrink-0">
                  <button onClick={() => move(link.id, 'up')} disabled={i === 0}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-20"
                    style={{ color: 'var(--adm-muted)' }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>
                  </button>
                  <button onClick={() => move(link.id, 'down')} disabled={i === links.length - 1}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-20"
                    style={{ color: 'var(--adm-muted)' }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  <button onClick={() => handleRemove(link.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors mt-1"
                    style={{ color: 'var(--adm-muted)' }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
