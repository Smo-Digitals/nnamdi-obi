'use client';

import { useRef, useState } from 'react';
import { CloudArrowUp, X } from 'phosphor-react';

interface Props {
  url: string | undefined;
  onChange: (url: string) => void;
  accept: string;
  placeholder: string;
}

export function FileUploadField({ url, onChange, accept, placeholder }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true); setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'roadmaps');
      const res = await fetch('/api/upload-file', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Upload failed'); return; }
      onChange(data.url);
    } catch {
      setError('Network error — could not upload.');
    } finally { setUploading(false); }
  }

  const fieldCls = 'flex-1 px-3 py-2 rounded-lg border bg-transparent text-xs outline-none focus:border-[#DC5B17] transition-colors';
  const style = { color: 'var(--adm-text)', borderColor: 'var(--adm-border)' };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <input value={url ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className={fieldCls} style={style} />
        {url && (
          <button onClick={() => onChange('')} className="text-[#555] hover:text-red-400 transition-colors shrink-0"><X size={14} /></button>
        )}
        <input ref={fileRef} type="file" accept={accept} className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }} />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[11px] font-semibold shrink-0 hover:bg-white/5 transition-colors disabled:opacity-50"
          style={style}
        >
          {uploading ? (
            <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <CloudArrowUp size={13} />
          )}
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </div>
  );
}
