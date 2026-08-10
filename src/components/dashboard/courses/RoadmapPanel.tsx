'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash, WarningCircle } from 'phosphor-react';
import { FileUploadField } from './FileUploadField';

export type Roadmap = {
  id: string; title: string; slug: string | null; description: string | null;
  cover_image_url: string | null; price: number | null;
  status: 'draft' | 'published' | 'archived'; cooldown_days?: number; created_at: string;
};

interface Props {
  open: boolean; onClose: () => void;
  editing: Roadmap | null;
  onSaved: (r: Roadmap) => void;
  onDeleted: (id: string) => void;
}

export function RoadmapPanel({ open, onClose, editing, onSaved, onDeleted }: Props) {
  const [title,        setTitle]        = useState('');
  const [description,  setDescription]  = useState('');
  const [coverImage,   setCoverImage]   = useState('');
  const [price,        setPrice]        = useState(0);
  const [cooldownDays, setCooldownDays] = useState(30);
  const [status,       setStatus]       = useState<'draft' | 'published' | 'archived'>('draft');
  const [saving,       setSaving]       = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setTitle(editing?.title ?? '');
      setDescription(editing?.description ?? '');
      setCoverImage(editing?.cover_image_url ?? '');
      setPrice(editing?.price ?? 0);
      setCooldownDays(editing?.cooldown_days ?? 30);
      setStatus(editing?.status ?? 'draft');
    }
  }, [open, editing]);

  async function save() {
    if (!title.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(null);
    const url    = editing ? `/api/roadmaps/${editing.id}` : '/api/roadmaps';
    const method = editing ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim() || null,
        cover_image_url: coverImage.trim() || null,
        price,
        cooldown_days: cooldownDays,
        status,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return; }
    onSaved(data as Roadmap);
  }

  async function remove() {
    if (!editing) return;
    setDeleting(true);
    await fetch(`/api/roadmaps/${editing.id}`, { method: 'DELETE' });
    setDeleting(false);
    onDeleted(editing.id);
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border bg-transparent text-sm outline-none focus:border-[#DC5B17] transition-colors';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 h-full w-full max-w-lg z-50 flex flex-col shadow-2xl"
            style={{ backgroundColor: 'var(--adm-panel)' }}>

            <div className="flex items-center justify-between p-6 border-b shrink-0" style={{ borderColor: 'var(--adm-border)' }}>
              <h2 className="font-semibold text-base" style={{ color: 'var(--adm-text)' }}>{editing ? 'Edit Roadmap' : 'New Roadmap'}</h2>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#555] hover:text-white hover:bg-white/5 transition-colors"><X size={16} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              {error && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <WarningCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Roadmap title…"
                  className={inputCls} style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }} />
              </div>

              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="What is this roadmap about?"
                  className={`${inputCls} resize-none`} style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }} />
              </div>

              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Cover Image</label>
                <FileUploadField url={coverImage} onChange={setCoverImage} accept="image/*" placeholder="Image URL, or upload…" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Price (₦)</label>
                  <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))}
                    className={inputCls} style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }} />
                  <p className="text-[10px] mt-1" style={{ color: 'var(--adm-muted)' }}>0 = free</p>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Reapply cooldown (days)</label>
                  <input type="number" min={0} value={cooldownDays} onChange={(e) => setCooldownDays(Number(e.target.value))}
                    className={inputCls} style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }} />
                  <p className="text-[10px] mt-1" style={{ color: 'var(--adm-muted)' }}>Wait time after a rejection</p>
                </div>
              </div>

              <div className="flex gap-2">
                {(['draft', 'published', 'archived'] as const).map((s) => (
                  <button key={s} onClick={() => setStatus(s)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border capitalize transition-colors ${
                      status === s
                        ? (s === 'published' ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : s === 'draft' ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'
                          : 'bg-white/5 border-white/20 text-[#999]')
                        : 'text-[#555] hover:text-white'
                    }`}
                    style={status !== s ? { borderColor: 'var(--adm-border)' } : {}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-t shrink-0 flex items-center gap-3" style={{ borderColor: 'var(--adm-border)' }}>
              {editing && (
                <button onClick={remove} disabled={deleting}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border text-[#555] hover:text-red-400 hover:border-red-400/30 transition-colors"
                  style={{ borderColor: 'var(--adm-border)' }}>
                  {deleting ? <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Trash size={15} />}
                </button>
              )}
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold text-[#555] hover:text-white transition-colors" style={{ borderColor: 'var(--adm-border)' }}>Cancel</button>
              <button onClick={save} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Create'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
