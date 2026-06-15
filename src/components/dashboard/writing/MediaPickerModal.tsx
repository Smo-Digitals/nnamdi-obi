'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, CloudArrowUp, CheckCircle, Trash, MagnifyingGlass, Warning } from 'phosphor-react';

type MediaFile = { key: string; name: string; url: string; type: string; size: number; lastModified: string };

interface Props {
  open:       boolean;
  onClose:    () => void;
  onSelect:   (url: string | null) => void;
  currentUrl: string | null;
}

export function MediaPickerModal({ open, onClose, onSelect, currentUrl }: Props) {
  const [tab,         setTab]         = useState<'library' | 'upload'>('library');
  const [files,       setFiles]       = useState<MediaFile[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [loadError,   setLoadError]   = useState<string | null>(null);
  const [uploading,   setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selected,    setSelected]    = useState<string | null>(null);
  const [search,      setSearch]      = useState('');
  const [dragging,    setDragging]    = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch('/api/media?folder=all');
      if (!res.ok) { setLoadError(`Failed to load media (${res.status})`); return; }
      const data: MediaFile[] = await res.json();
      setFiles(data.filter((f) => f.type === 'image'));
    } catch {
      setLoadError('Network error loading media.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (open) { setSelected(currentUrl); setSearch(''); setTab('library'); setUploadError(null); loadMedia(); }
  }, [open, currentUrl, loadMedia]);

  async function upload(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'posts');
      const res = await fetch('/api/upload-image', { method: 'POST', body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setUploadError(err.error ?? `Upload failed (${res.status})`);
        return;
      }
      const { url } = await res.json();
      await loadMedia();
      setSelected(url);
      setTab('library');
    } catch {
      setUploadError('Network error — could not upload.');
    } finally { setUploading(false); }
  }

  function handleFiles(list: FileList | null) {
    const f = list?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { setUploadError('File is too large (max 10 MB).'); return; }
    upload(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files);
  }

  const filtered = files.filter((f) => !search || f.name.toLowerCase().includes(search.toLowerCase()));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>

      {/* Hidden file input — outside drop zone to avoid click bubbling */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />

      <div className="w-full max-w-3xl rounded-2xl border flex flex-col overflow-hidden"
        style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)', maxHeight: '85vh' }}>

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--adm-border)' }}>
          <h2 className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>Media Library</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={14} style={{ color: 'var(--adm-muted)' }} />
          </button>
        </div>

        {/* Tabs */}
        <div className="shrink-0 flex gap-1 px-5 pt-3">
          {(['library', 'upload'] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setUploadError(null); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${tab === t ? 'bg-[#DC5B17] text-white' : 'hover:bg-white/5'}`}
              style={tab !== t ? { color: 'var(--adm-muted)' } : {}}>
              {t === 'library' ? 'Media Library' : 'Upload New'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 min-h-0">
          {tab === 'library' ? (
            <>
              <div className="relative mb-4">
                <MagnifyingGlass size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--adm-muted)' }} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search images…"
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border outline-none"
                  style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }} />
              </div>

              {loadError ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
                  <Warning size={24} className="text-red-400" />
                  <p className="text-sm text-red-400">{loadError}</p>
                  <button onClick={loadMedia} className="mt-2 px-4 py-1.5 rounded-xl bg-[#DC5B17] text-white text-xs font-semibold">Retry</button>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-16 gap-2 text-xs" style={{ color: 'var(--adm-muted)' }}>
                  <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Loading…
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--adm-muted)' }}>No images yet</p>
                  <p className="text-xs mb-4" style={{ color: 'var(--adm-muted)' }}>Upload your first image to get started</p>
                  <button onClick={() => setTab('upload')} className="px-4 py-2 rounded-xl bg-[#DC5B17] text-white text-xs font-semibold">
                    Upload image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {filtered.map((f) => {
                    const isSel = selected === f.url;
                    return (
                      <button key={f.key} onClick={() => setSelected(isSel ? null : f.url)}
                        className="relative group aspect-square rounded-xl overflow-hidden border-2 transition-all"
                        style={{ borderColor: isSel ? '#DC5B17' : 'transparent', backgroundColor: 'var(--adm-bg)' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                        {isSel && (
                          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(220,91,23,0.25)' }}>
                            <CheckCircle size={28} weight="fill" className="text-[#DC5B17]" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-[9px] truncate">{f.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onClick={() => !uploading && fileRef.current?.click()}
                className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed cursor-pointer transition-colors"
                style={{ borderColor: dragging ? '#DC5B17' : 'var(--adm-border)', backgroundColor: dragging ? 'rgba(220,91,23,0.05)' : 'var(--adm-bg)' }}>
                {uploading ? (
                  <>
                    <div className="w-8 h-8 rounded-full border-2 border-[#DC5B17] border-t-transparent animate-spin mb-3" />
                    <p className="text-sm font-medium" style={{ color: 'var(--adm-muted)' }}>Uploading…</p>
                  </>
                ) : (
                  <>
                    <CloudArrowUp size={36} style={{ color: 'var(--adm-muted)' }} className="mb-3" />
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--adm-text)' }}>Drop image here or click to browse</p>
                    <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>PNG, JPG, WEBP, GIF · max 10 MB</p>
                  </>
                )}
              </div>

              {uploadError && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400 border border-red-400/20 bg-red-400/5">
                  <Warning size={15} weight="fill" />
                  {uploadError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-t" style={{ borderColor: 'var(--adm-border)' }}>
          <div>
            {currentUrl && (
              <button onClick={() => { onSelect(null); onClose(); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors">
                <Trash size={13} weight="bold" /> Remove cover
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-white/5"
              style={{ color: 'var(--adm-muted)', borderColor: 'var(--adm-border)' }}>
              Cancel
            </button>
            <button disabled={!selected} onClick={() => { if (selected) { onSelect(selected); onClose(); } }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#DC5B17] text-white hover:bg-[#c44f13] transition-colors disabled:opacity-40">
              Use image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
