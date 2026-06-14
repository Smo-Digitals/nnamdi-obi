'use client';

import { useState, useCallback, useRef } from 'react';
import { CloudArrowUp, Folder, MagnifyingGlass, Image, VideoCamera, FilePdf, File } from 'phosphor-react';
import { MediaFileCard, type MediaFile } from './MediaFileCard';

const FOLDERS = [
  { id: 'all',           label: 'All Files',     icon: Image },
  { id: 'announcements', label: 'Announcements', icon: Image },
  { id: 'editor',        label: 'Editor',        icon: Image },
  { id: 'avatars',       label: 'Avatars',       icon: Image },
  { id: 'media',         label: 'Media',         icon: Image },
];

const TYPE_FILTERS = [
  { id: 'all',   label: 'All',    icon: Image },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'video', label: 'Videos', icon: VideoCamera },
  { id: 'pdf',   label: 'PDFs',   icon: FilePdf },
  { id: 'other', label: 'Other',  icon: File },
];

function formatStorage(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return mb < 1024 ? `${mb.toFixed(1)} MB` : `${(mb / 1024).toFixed(2)} GB`;
}

interface Props { initialFiles: MediaFile[] }

export function MediaLibraryClient({ initialFiles }: Props) {
  const [files,       setFiles]       = useState<MediaFile[]>(initialFiles);
  const [folder,      setFolder]      = useState('all');
  const [typeFilter,  setTypeFilter]  = useState('all');
  const [search,      setSearch]      = useState('');
  const [uploading,   setUploading]   = useState(false);
  const [dragging,    setDragging]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  async function loadFolder(f: string) {
    setFolder(f); setLoading(true);
    const res  = await fetch(`/api/media?folder=${f}`);
    const data = await res.json();
    setFiles(data); setLoading(false);
  }

  async function uploadFiles(fileList: FileList) {
    setUploading(true);
    const uploaded: MediaFile[] = [];
    for (const file of Array.from(fileList)) {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', folder === 'all' ? 'media' : folder);
      const res = await fetch('/api/upload-image', { method: 'POST', body: form });
      if (res.ok) {
        const { url } = await res.json();
        uploaded.push({
          key: url.split('.dev/')[1], name: file.name, folder: folder === 'all' ? 'media' : folder,
          size: file.size, lastModified: new Date().toISOString(), url, type: 'image',
        });
      }
    }
    setFiles((prev) => [...uploaded, ...prev]);
    setUploading(false);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }, [folder]);

  function onDelete(key: string) { setFiles((prev) => prev.filter((f) => f.key !== key)); }

  const filtered = files.filter((f) => {
    const matchType   = typeFilter === 'all' || f.type === typeFilter;
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const totalStorage = files.reduce((s, f) => s + f.size, 0);
  const folderCounts = Object.fromEntries(FOLDERS.slice(1).map((f) => [f.id, files.filter((file) => file.folder === f.id).length]));

  const uniqueFolders = [...new Set(filtered.map((f) => f.folder))];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r flex flex-col overflow-y-auto" style={{ borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-sidebar)' }}>
        <div className="p-4 border-b shrink-0" style={{ borderColor: 'var(--adm-border)' }}>
          <input ref={uploadRef} type="file" accept="image/*,video/*,.pdf" multiple className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
          <button onClick={() => uploadRef.current?.click()} disabled={uploading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-60">
            <CloudArrowUp size={16} weight="bold" />
            {uploading ? 'Uploading…' : 'Upload Media'}
          </button>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-0.5">
          {FOLDERS.map(({ id, label }) => (
            <button key={id} onClick={() => loadFolder(id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${folder === id ? 'bg-white/[0.07] text-white' : 'text-[#555] hover:text-white hover:bg-white/[0.04]'}`}>
              <span className="flex items-center gap-2.5"><Folder size={14} className={folder === id ? 'text-[#DC5B17]' : ''} />{label}</span>
              {id !== 'all' && <span className="text-[10px]" style={{ color: 'var(--adm-muted)' }}>{folderCounts[id] ?? 0}</span>}
            </button>
          ))}
        </nav>

        {/* Storage */}
        <div className="p-4 border-t shrink-0" style={{ borderColor: 'var(--adm-border)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--adm-muted)' }}>Storage</p>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-1.5">
            <div className="h-full rounded-full bg-[#DC5B17]" style={{ width: `${Math.min((totalStorage / (500 * 1024 * 1024)) * 100, 100)}%` }} />
          </div>
          <p className="text-[10px]" style={{ color: 'var(--adm-muted)' }}>{formatStorage(totalStorage)} used</p>
        </div>
      </aside>

      {/* Main */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {/* Toolbar */}
        <div className="shrink-0 px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--adm-border)' }}>
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl border" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <MagnifyingGlass size={14} className="text-[#444] shrink-0" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files…"
              className="flex-1 bg-transparent text-sm outline-none" style={{ color: 'var(--adm-text)' }} />
          </div>
          <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--adm-card)' }}>
            {TYPE_FILTERS.map(({ id, label }) => (
              <button key={id} onClick={() => setTypeFilter(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${typeFilter === id ? 'bg-[#DC5B17] text-white' : 'text-[#555] hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>
          <span className="text-xs shrink-0" style={{ color: 'var(--adm-muted)' }}>{filtered.length} files</span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {dragging && (
            <div className="absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-[#DC5B17] bg-[#DC5B17]/5 rounded-2xl m-4 pointer-events-none">
              <div className="text-center">
                <CloudArrowUp size={40} className="text-[#DC5B17] mx-auto mb-2" />
                <p className="font-semibold text-[#DC5B17]">Drop files to upload</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <span className="w-6 h-6 rounded-full border-2 border-[#DC5B17] border-t-transparent animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed" style={{ borderColor: 'var(--adm-border)' }}>
              <Image size={32} className="text-[#333] mb-3" />
              <p className="font-semibold text-sm mb-1" style={{ color: 'var(--adm-text)' }}>No files yet</p>
              <p className="text-xs mb-4" style={{ color: 'var(--adm-muted)' }}>Upload files or drag & drop here</p>
              <button onClick={() => uploadRef.current?.click()} className="px-4 py-2 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">
                Upload Media
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {uniqueFolders.map((f) => {
                const folderFiles = filtered.filter((file) => file.folder === f);
                return (
                  <div key={f}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--adm-muted)' }}>
                      {f} <span className="ml-1 opacity-50">({folderFiles.length})</span>
                    </p>
                    <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
                      {folderFiles.map((file) => (
                        <MediaFileCard key={file.key} file={file} onDelete={onDelete} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
