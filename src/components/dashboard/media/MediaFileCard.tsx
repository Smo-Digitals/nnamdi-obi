'use client';

import { useState, useRef, useEffect } from 'react';
import { Image, FilePdf, VideoCamera, File, DotsThree, CopySimple, DownloadSimple, Trash } from 'phosphor-react';

export type MediaFile = {
  key: string; name: string; folder: string; size: number;
  lastModified: string; url: string; type: 'image' | 'video' | 'pdf' | 'other';
};

interface Props { file: MediaFile; onDelete: (key: string) => void }

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const TYPE_ICON = {
  image: Image, video: VideoCamera, pdf: FilePdf, other: File,
};

export function MediaFileCard({ file, onDelete }: Props) {
  const [menu,     setMenu]     = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const Icon = TYPE_ICON[file.type];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function copyUrl() {
    navigator.clipboard.writeText(file.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    setMenu(false);
  }

  async function deleteFile() {
    setDeleting(true);
    setMenu(false);
    await fetch('/api/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: file.key }) });
    onDelete(file.key);
  }

  return (
    <div className="group relative rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
      {/* Thumbnail */}
      <div className="relative w-full aspect-square overflow-hidden" style={{ backgroundColor: 'var(--adm-bg)' }}>
        {file.type === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon size={32} className="text-[#444]" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={copyUrl}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            title="Copy URL">
            <CopySimple size={14} />
          </button>
          <a href={file.url} download={file.name} target="_blank" rel="noreferrer"
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            title="Download">
            <DownloadSimple size={14} />
          </a>
        </div>

        {copied && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="text-xs font-semibold text-green-400">Copied!</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-2.5 py-2 flex items-center gap-1.5">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium truncate" style={{ color: 'var(--adm-text)' }}>{file.name}</p>
          <p className="text-[10px]" style={{ color: 'var(--adm-muted)' }}>{formatSize(file.size)}</p>
        </div>

        {/* 3-dot menu */}
        <div ref={menuRef} className="relative shrink-0">
          <button onClick={() => setMenu((o) => !o)}
            className="w-6 h-6 flex items-center justify-center rounded-md text-[#444] hover:text-white hover:bg-white/5 transition-colors">
            <DotsThree size={15} weight="bold" />
          </button>
          {menu && (
            <div className="absolute right-0 bottom-7 w-40 rounded-xl border shadow-xl z-20 overflow-hidden py-1"
              style={{ backgroundColor: 'var(--adm-drop)', borderColor: 'var(--adm-border)' }}>
              <button onClick={copyUrl} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-text)' }}>
                <CopySimple size={13} /> Copy URL
              </button>
              <a href={file.url} download={file.name} target="_blank" rel="noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-text)' }}>
                <DownloadSimple size={13} /> Download
              </a>
              <button onClick={deleteFile} disabled={deleting}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-400/5 transition-colors">
                <Trash size={13} /> {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
