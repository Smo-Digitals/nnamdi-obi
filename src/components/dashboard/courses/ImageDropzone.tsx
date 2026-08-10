'use client';

import { useRef, useState } from 'react';
import { Image as ImageIcon, CloudArrowUp, X, ArrowsClockwise } from 'phosphor-react';

interface Props { url: string | null; onChange: (url: string | null) => void }

export function ImageDropzone({ url, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragging,  setDragging]  = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true); setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'courses');
      const res = await fetch('/api/upload-image', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Upload failed'); return; }
      onChange(data.url);
    } catch {
      setError('Network error — could not upload.');
    } finally { setUploading(false); }
  }

  function handleFiles(list: FileList | null) {
    const f = list?.[0];
    if (f) upload(f);
  }

  return (
    <div className="flex flex-col gap-2">
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />

      {url ? (
        <div className="relative rounded-2xl overflow-hidden border group" style={{ borderColor: 'var(--adm-border)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Featured" className="w-full aspect-video object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors">
              <ArrowsClockwise size={13} weight="bold" /> Replace
            </button>
            <button onClick={() => onChange(null)}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/15 text-white hover:bg-red-500/80 transition-colors">
              <X size={14} weight="bold" />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          className="flex flex-col items-center justify-center gap-2.5 py-10 rounded-2xl border-2 border-dashed cursor-pointer transition-colors"
          style={{
            borderColor: dragging ? '#DC5B17' : 'var(--adm-border)',
            backgroundColor: dragging ? 'rgba(220,91,23,0.06)' : 'var(--adm-bg)',
          }}
        >
          {uploading ? (
            <>
              <span className="w-8 h-8 rounded-full border-2 border-[#DC5B17] border-t-transparent animate-spin" />
              <p className="text-xs font-medium" style={{ color: 'var(--adm-muted)' }}>Uploading…</p>
            </>
          ) : (
            <>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(220,91,23,0.12)', color: '#DC5B17' }}>
                <ImageIcon size={20} weight="bold" />
              </div>
              <button type="button" className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#DC5B17' }}>
                <CloudArrowUp size={13} weight="bold" /> Upload Thumbnail
              </button>
              <p className="text-[10px]" style={{ color: 'var(--adm-muted)' }}>JPG, PNG, WEBP, GIF · max 10MB</p>
            </>
          )}
        </div>
      )}
      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </div>
  );
}
