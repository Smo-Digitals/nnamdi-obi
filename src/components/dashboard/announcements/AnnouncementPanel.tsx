'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash } from 'phosphor-react';
import type { Announcement } from './AnnouncementsClient';

interface Props {
  open:      boolean;
  onClose:   () => void;
  editing:   Announcement | null;
  onSaved:   (a: Announcement) => void;
  onDeleted: (id: string) => void;
}

export function AnnouncementPanel({ open, onClose, editing, onSaved, onDeleted }: Props) {
  const [title,    setTitle]    = useState('');
  const [body,     setBody]     = useState('');
  const [status,   setStatus]   = useState<'draft' | 'published'>('draft');
  const [pinned,   setPinned]   = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(editing?.title ?? '');
      setBody(editing?.body ?? '');
      setStatus(editing?.status === 'published' ? 'published' : 'draft');
      setPinned(editing?.pinned ?? false);
    }
  }, [open, editing]);

  async function save() {
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    const url    = editing ? `/api/announcements/${editing.id}` : '/api/announcements';
    const method = editing ? 'PATCH' : 'POST';
    const res    = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), body: body.trim(), status, pinned }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) onSaved(data as Announcement);
  }

  async function remove() {
    if (!editing) return;
    setDeleting(true);
    await fetch(`/api/announcements/${editing.id}`, { method: 'DELETE' });
    setDeleting(false);
    onDeleted(editing.id);
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border bg-transparent text-sm outline-none transition-colors focus:border-[#DC5B17]';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col shadow-2xl"
            style={{ backgroundColor: 'var(--adm-panel)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--adm-border)' }}>
              <h2 className="font-semibold text-base" style={{ color: 'var(--adm-text)' }}>
                {editing ? 'Edit Announcement' : 'New Announcement'}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#555] hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Announcement title…"
                  className={inputCls}
                  style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Message</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your announcement…"
                  rows={8}
                  className={`${inputCls} resize-none`}
                  style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Status</label>
                <div className="flex gap-2">
                  {(['draft', 'published'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize border transition-colors ${
                        status === s
                          ? s === 'published'
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'
                          : 'text-[#555] hover:text-white'
                      }`}
                      style={status !== s ? { borderColor: 'var(--adm-border)' } : {}}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: 'var(--adm-border)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>Pin announcement</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--adm-muted)' }}>Show at the top of the feed</p>
                </div>
                <button
                  onClick={() => setPinned((p) => !p)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${pinned ? 'bg-[#DC5B17]' : 'bg-white/10'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${pinned ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t flex items-center gap-3" style={{ borderColor: 'var(--adm-border)' }}>
              {editing && (
                <button
                  onClick={remove}
                  disabled={deleting}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border text-[#555] hover:text-red-400 hover:border-red-400/30 transition-colors"
                  style={{ borderColor: 'var(--adm-border)' }}
                >
                  {deleting
                    ? <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    : <Trash size={15} />}
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border text-sm font-semibold text-[#555] hover:text-white transition-colors"
                style={{ borderColor: 'var(--adm-border)' }}
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !title.trim() || !body.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Create'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
