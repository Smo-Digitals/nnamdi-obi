'use client';

import { useRef, useState, useCallback } from 'react';
import { CloudArrowUp, X, Link, Image } from 'phosphor-react';

interface Props {
  value:    string | null;
  onChange: (url: string | null) => void;
  folder?:  string;
  label?:   string;
}

type Tab = 'upload' | 'url';

async function uploadToR2(file: File, folder: string): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);
  const res = await fetch('/api/upload-image', { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Upload failed');
  return data.url as string;
}

export function ImageUploader({ value, onChange, folder = 'media', label }: Props) {
  const [tab,        setTab]        = useState<Tab>('upload');
  const [dragging,   setDragging]   = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [urlInput,   setUrlInput]   = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const url = await uploadToR2(file, folder);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  function applyUrl() {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput('');
  }

  if (value) {
    return (
      <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: 'var(--adm-border)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="Cover" className="w-full h-40 object-cover" />
        <button
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
        >
          <X size={13} weight="bold" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{label}</p>}

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ backgroundColor: 'var(--adm-card)' }}>
        {([['upload', 'Upload', Image], ['url', 'URL', Link]] as [Tab, string, React.ElementType][]).map(([t, name, Icon]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === t ? 'bg-[#DC5B17] text-white' : 'text-[#555] hover:text-white'
            }`}>
            <Icon size={12} />{name}
          </button>
        ))}
      </div>

      {tab === 'upload' ? (
        <>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileInput} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            disabled={uploading}
            className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${
              dragging ? 'border-[#DC5B17] bg-[#DC5B17]/5' : 'hover:border-white/20 hover:bg-white/[0.02]'
            }`}
            style={{ borderColor: dragging ? '#DC5B17' : 'var(--adm-border)' }}
          >
            {uploading ? (
              <>
                <span className="w-6 h-6 rounded-full border-2 border-[#DC5B17] border-t-transparent animate-spin" />
                <span className="text-xs" style={{ color: 'var(--adm-muted)' }}>Uploading…</span>
              </>
            ) : (
              <>
                <CloudArrowUp size={24} className={dragging ? 'text-[#DC5B17]' : 'text-[#444]'} />
                <div className="text-center">
                  <p className="text-xs font-semibold" style={{ color: dragging ? '#DC5B17' : 'var(--adm-muted)' }}>
                    {dragging ? 'Drop to upload' : 'Drag & drop or click to browse'}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--adm-muted)' }}>PNG, JPG, WebP, GIF · max 10MB</p>
                </div>
              </>
            )}
          </button>
        </>
      ) : (
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') applyUrl(); }}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2.5 rounded-xl border bg-transparent text-sm outline-none focus:border-[#DC5B17] transition-colors"
            style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }}
          />
          <button
            onClick={applyUrl}
            className="px-4 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors"
          >
            Use
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
