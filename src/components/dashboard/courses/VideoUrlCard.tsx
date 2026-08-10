'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlayCircle, X, LinkSimple, ArrowsOut } from 'phosphor-react';

interface Props { url: string | null; onChange: (url: string | null) => void }

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}
function driveId(url: string): string | null {
  const m = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ?? url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}
function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}
function isDirectVideoFile(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
}

function PreviewModal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-6" onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden bg-black" onClick={(e) => e.stopPropagation()}
        >
          {children}
          <button onClick={onClose}
            className="hover-brighten absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-lg bg-black/60 text-white">
            <X size={16} weight="bold" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function VideoUrlCard({ url, onChange }: Props) {
  const [draft, setDraft] = useState('');
  const [vimeoThumb, setVimeoThumb] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const ytId = url ? youtubeId(url) : null;
  const gdId = url ? driveId(url) : null;
  const vmId = !ytId && !gdId && url ? vimeoId(url) : null;
  const directFile = url ? isDirectVideoFile(url) : false;
  const embeddable = !!(ytId || gdId || vmId || directFile);

  useEffect(() => {
    setVimeoThumb(null);
    if (!vmId || !url) return;
    fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}&width=640&height=360`)
      .then((r) => r.json())
      .then((d) => setVimeoThumb(d.thumbnail_url ?? null))
      .catch(() => {});
  }, [url, vmId]);

  function openPreview() {
    if (embeddable) setExpanded(true);
    else if (url) window.open(url, '_blank', 'noopener,noreferrer');
  }

  function renderEmbed() {
    if (gdId) return <iframe src={`https://drive.google.com/file/d/${gdId}/preview`} className="w-full h-full border-0" allow="autoplay" />;
    if (ytId) return <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} className="w-full h-full border-0" allow="autoplay; fullscreen" allowFullScreen />;
    if (vmId) return <iframe src={`https://player.vimeo.com/video/${vmId}?autoplay=1`} className="w-full h-full border-0" allow="autoplay; fullscreen" allowFullScreen />;
    if (directFile) return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video src={url ?? undefined} controls autoPlay className="w-full h-full" />
    );
    return null;
  }

  if (url) {
    const inlineInteractive = gdId || directFile;

    return (
      <>
        <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-bg)' }}>
          <div className="relative w-full aspect-video">
            {inlineInteractive ? (
              renderEmbed()
            ) : (
              <button onClick={openPreview} className="relative block w-full h-full group">
                {ytId ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                    onError={(e) => { const img = e.currentTarget; if (!img.dataset.fallback) { img.dataset.fallback = '1'; img.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`; } }}
                    alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                ) : vmId && vimeoThumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={vimeoThumb} alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--adm-card)' }}>
                    <LinkSimple size={22} style={{ color: 'var(--adm-muted)' }} />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none">
                  <PlayCircle size={40} weight="fill" className="text-white/90" />
                </div>
              </button>
            )}
          </div>
          {embeddable && (
            <button onClick={() => setExpanded(true)}
              className="hover-brighten absolute top-2 left-2 flex items-center justify-center w-7 h-7 rounded-lg bg-black/50 text-white">
              <ArrowsOut size={13} weight="bold" />
            </button>
          )}
          <button onClick={() => onChange(null)}
            className="hover-brighten absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-lg bg-black/50 text-white hover:bg-red-500/80">
            <X size={13} weight="bold" />
          </button>
        </div>

        {expanded && embeddable && (
          <PreviewModal onClose={() => setExpanded(false)}>{renderEmbed()}</PreviewModal>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2.5 py-8 px-4 rounded-2xl border-2 border-dashed"
      style={{ borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-card)' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(220,91,23,0.12)', color: '#DC5B17' }}>
        <PlayCircle size={20} weight="bold" />
      </div>
      <div className="flex items-center gap-2 w-full">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && draft.trim()) onChange(draft.trim()); }}
          placeholder="Paste a YouTube, Vimeo, Google Drive, or hosted video URL…"
          className="flex-1 px-3 py-2 rounded-lg border bg-transparent text-xs outline-none focus:border-[#DC5B17] transition-colors"
          style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }}
        />
        <button onClick={() => draft.trim() && onChange(draft.trim())}
          className="px-3 py-2 rounded-lg text-xs font-semibold shrink-0" style={{ color: '#DC5B17' }}>
          Add
        </button>
      </div>
    </div>
  );
}
