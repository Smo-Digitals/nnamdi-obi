'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash, CalendarBlank, WarningCircle } from 'phosphor-react';
import type { Announcement } from './AnnouncementsClient';
import { RichTextEditor } from '@/components/dashboard/RichTextEditor';
import { ImageUploader } from '@/components/dashboard/ImageUploader';

interface Props {
  open:      boolean;
  onClose:   () => void;
  editing:   Announcement | null;
  onSaved:   (a: Announcement) => void;
  onDeleted: (id: string) => void;
}

type PanelStatus = 'draft' | 'published' | 'scheduled';

const STATUS_CFG: { value: PanelStatus; label: string; cls: string; active: string }[] = [
  { value: 'draft',     label: 'Draft',     cls: 'text-[#555]', active: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400' },
  { value: 'scheduled', label: 'Scheduled', cls: 'text-[#555]', active: 'bg-blue-400/10 border-blue-400/30 text-blue-400'       },
  { value: 'published', label: 'Published', cls: 'text-[#555]', active: 'bg-green-500/10 border-green-500/30 text-green-400'    },
];

function toLocalDatetimeValue(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function nowPlusFiveMin() {
  const d = new Date(Date.now() + 5 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function bodyIsEmpty(html: string) {
  return !html || html === '<p></p>' || html.replace(/<[^>]*>/g, '').trim() === '';
}

export function AnnouncementPanel({ open, onClose, editing, onSaved, onDeleted }: Props) {
  const [title,          setTitle]          = useState('');
  const [body,           setBody]           = useState('');
  const [status,         setStatus]         = useState<PanelStatus>('draft');
  const [scheduledAt,    setScheduledAt]    = useState('');
  const [pinned,         setPinned]         = useState(false);
  const [coverImageUrl,  setCoverImageUrl]  = useState('');
  const [coverVideoUrl,  setCoverVideoUrl]  = useState('');
  const [saving,         setSaving]         = useState(false);
  const [deleting,       setDeleting]       = useState(false);
  const [error,          setError]          = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setTitle(editing?.title ?? '');
      setBody(editing?.body ?? '');
      setPinned(editing?.pinned ?? false);
      setCoverImageUrl(editing?.cover_image_url ?? '');
      setCoverVideoUrl(editing?.cover_video_url ?? '');
      const s = editing?.status;
      setStatus(s === 'published' ? 'published' : s === 'scheduled' ? 'scheduled' : 'draft');
      setScheduledAt(toLocalDatetimeValue(editing?.scheduled_at) || nowPlusFiveMin());
    }
  }, [open, editing]);

  async function save() {
    if (!title.trim() || bodyIsEmpty(body)) return;
    if (status === 'scheduled' && !scheduledAt) { setError('Please pick a date and time.'); return; }
    if (status === 'scheduled' && new Date(scheduledAt) <= new Date()) { setError('Scheduled time must be in the future.'); return; }

    setError(null);
    setSaving(true);
    const url    = editing ? `/api/announcements/${editing.id}` : '/api/announcements';
    const method = editing ? 'PATCH' : 'POST';
    const res    = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title:           title.trim(),
        body:            body.trim(),
        status,
        pinned,
        scheduled_at:    status === 'scheduled' ? new Date(scheduledAt).toISOString() : null,
        cover_image_url: coverImageUrl.trim() || null,
        cover_video_url: coverVideoUrl.trim() || null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? 'Something went wrong. Check the Supabase table exists.'); return; }
    onSaved(data as Announcement);
  }

  async function remove() {
    if (!editing) return;
    setDeleting(true);
    const res = await fetch(`/api/announcements/${editing.id}`, { method: 'DELETE' });
    setDeleting(false);
    if (!res.ok) { setError('Delete failed.'); return; }
    onDeleted(editing.id);
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border bg-transparent text-sm outline-none transition-colors focus:border-[#DC5B17]';
  const canSave  = title.trim() && !bodyIsEmpty(body) && !saving;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 h-full w-full max-w-lg z-50 flex flex-col shadow-2xl"
            style={{ backgroundColor: 'var(--adm-panel)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b shrink-0" style={{ borderColor: 'var(--adm-border)' }}>
              <h2 className="font-semibold text-base" style={{ color: 'var(--adm-text)' }}>
                {editing ? 'Edit Announcement' : 'New Announcement'}
              </h2>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#555] hover:text-white hover:bg-white/5 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <WarningCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                  <p className="text-red-400 text-xs leading-relaxed">{error}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title…"
                  className={inputCls} style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }} />
              </div>

              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Content</label>
                <RichTextEditor value={body} onChange={setBody} />
              </div>

              {/* Cover media */}
              <div className="flex flex-col gap-4">
                <p className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>Cover Media <span className="font-normal opacity-60">(optional)</span></p>
                <ImageUploader
                  label="Cover Image"
                  value={coverImageUrl || null}
                  onChange={(url) => setCoverImageUrl(url ?? '')}
                  folder="announcements"
                />
                <div>
                  <p className="text-[10px] mb-1.5" style={{ color: 'var(--adm-muted)' }}>Cover Video URL <span className="opacity-60">(YouTube)</span></p>
                  <input
                    value={coverVideoUrl}
                    onChange={(e) => setCoverVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className={inputCls}
                    style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Status</label>
                <div className="flex gap-2">
                  {STATUS_CFG.map(({ value, label, cls, active }) => (
                    <button key={value} onClick={() => setStatus(value)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${status === value ? active : `${cls} hover:text-white`}`}
                      style={status !== value ? { borderColor: 'var(--adm-border)' } : {}}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Datetime picker — shown only for Scheduled */}
                {status === 'scheduled' && (
                  <div className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ borderColor: 'var(--adm-border)' }}>
                    <CalendarBlank size={15} className="text-blue-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--adm-muted)' }}>Publish at</p>
                      <input
                        type="datetime-local"
                        value={scheduledAt}
                        min={nowPlusFiveMin()}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        className="w-full bg-transparent text-sm outline-none"
                        style={{ color: 'var(--adm-text)', colorScheme: 'dark' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Pin */}
              <div className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: 'var(--adm-border)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>Pin announcement</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--adm-muted)' }}>Show at the top of the feed</p>
                </div>
                <button onClick={() => setPinned((p) => !p)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${pinned ? 'bg-[#DC5B17]' : 'bg-white/10'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${pinned ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t shrink-0 flex items-center gap-3" style={{ borderColor: 'var(--adm-border)' }}>
              {editing && (
                <button onClick={remove} disabled={deleting}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border text-[#555] hover:text-red-400 hover:border-red-400/30 transition-colors"
                  style={{ borderColor: 'var(--adm-border)' }}>
                  {deleting ? <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Trash size={15} />}
                </button>
              )}
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border text-sm font-semibold text-[#555] hover:text-white transition-colors"
                style={{ borderColor: 'var(--adm-border)' }}>
                Cancel
              </button>
              <button onClick={save} disabled={!canSave}
                className="flex-1 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : status === 'scheduled' ? 'Schedule' : editing ? 'Save changes' : 'Publish'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
