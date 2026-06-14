'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash, Plus, WarningCircle } from 'phosphor-react';

type RubricItem = { id: string; criterion: string; max_score: number };

export type Assignment = {
  id: string; course_id: string; title: string; description: string | null;
  due_date: string | null; rubric: RubricItem[]; reviews_required: number;
  status: 'draft' | 'published';
};

type Course = { id: string; title: string };

interface Props {
  open: boolean; onClose: () => void;
  editing: Assignment | null;
  courses: Course[];
  onSaved: (a: Assignment) => void;
  onDeleted: (id: string) => void;
}

function uid() { return Math.random().toString(36).slice(2, 10); }

export function AssignmentPanel({ open, onClose, editing, courses, onSaved, onDeleted }: Props) {
  const [courseId,   setCourseId]   = useState('');
  const [title,      setTitle]      = useState('');
  const [desc,       setDesc]       = useState('');
  const [dueDate,    setDueDate]    = useState('');
  const [rubric,     setRubric]     = useState<RubricItem[]>([{ id: uid(), criterion: '', max_score: 10 }]);
  const [required,   setRequired]   = useState(2);
  const [status,     setStatus]     = useState<'draft'|'published'>('draft');
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setCourseId(editing?.course_id ?? (courses[0]?.id ?? ''));
      setTitle(editing?.title ?? '');
      setDesc(editing?.description ?? '');
      setDueDate(editing?.due_date ? editing.due_date.slice(0, 16) : '');
      setRubric(editing?.rubric?.length ? editing.rubric : [{ id: uid(), criterion: '', max_score: 10 }]);
      setRequired(editing?.reviews_required ?? 2);
      setStatus(editing?.status ?? 'draft');
    }
  }, [open, editing, courses]);

  function addCriterion() { setRubric((r) => [...r, { id: uid(), criterion: '', max_score: 10 }]); }
  function removeCriterion(id: string) { setRubric((r) => r.filter((i) => i.id !== id)); }
  function updateCriterion(id: string, field: 'criterion' | 'max_score', val: string | number) {
    setRubric((r) => r.map((i) => i.id === id ? { ...i, [field]: val } : i));
  }

  async function save() {
    if (!title.trim() || !courseId) { setError('Title and course are required.'); return; }
    if (rubric.some((r) => !r.criterion.trim())) { setError('All rubric criteria need a name.'); return; }
    setSaving(true); setError(null);
    const url    = editing ? `/api/assignments/${editing.id}` : '/api/assignments';
    const method = editing ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: courseId, title: title.trim(), description: desc.trim(), due_date: dueDate || null, rubric, reviews_required: required, status }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return; }
    onSaved(data as Assignment);
  }

  async function remove() {
    if (!editing) return;
    setDeleting(true);
    await fetch(`/api/assignments/${editing.id}`, { method: 'DELETE' });
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
              <h2 className="font-semibold text-base" style={{ color: 'var(--adm-text)' }}>{editing ? 'Edit Assignment' : 'New Assignment'}</h2>
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
                <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Course</label>
                <select value={courseId} onChange={(e) => setCourseId(e.target.value)}
                  className={inputCls} style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }}>
                  {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title…"
                  className={inputCls} style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }} />
              </div>

              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Description</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="What should students do?"
                  className={`${inputCls} resize-none`} style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Due Date</label>
                  <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    className={inputCls} style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)', colorScheme: 'dark' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Reviews Required</label>
                  <input type="number" min={1} max={5} value={required} onChange={(e) => setRequired(Number(e.target.value))}
                    className={inputCls} style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }} />
                </div>
              </div>

              {/* Rubric builder */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>Rubric Criteria</label>
                  <button onClick={addCriterion}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#DC5B17] hover:text-[#c44f13] transition-colors">
                    <Plus size={12} weight="bold" /> Add Criterion
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {rubric.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input
                        value={item.criterion}
                        onChange={(e) => updateCriterion(item.id, 'criterion', e.target.value)}
                        placeholder="e.g. Clarity of argument"
                        className="flex-1 px-3 py-2.5 rounded-xl border bg-transparent text-sm outline-none focus:border-[#DC5B17] transition-colors"
                        style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }}
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number" min={1} max={100}
                          value={item.max_score}
                          onChange={(e) => updateCriterion(item.id, 'max_score', Number(e.target.value))}
                          className="w-16 px-2 py-2.5 rounded-xl border bg-transparent text-sm text-center outline-none focus:border-[#DC5B17] transition-colors"
                          style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }}
                        />
                        <span className="text-[10px]" style={{ color: 'var(--adm-muted)' }}>pts</span>
                      </div>
                      {rubric.length > 1 && (
                        <button onClick={() => removeCriterion(item.id)} className="text-[#444] hover:text-red-400 transition-colors"><Trash size={14} /></button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] mt-2" style={{ color: 'var(--adm-muted)' }}>
                  Total max score: {rubric.reduce((s, i) => s + i.max_score, 0)} pts
                </p>
              </div>

              {/* Status */}
              <div className="flex gap-2">
                {(['draft','published'] as const).map((s) => (
                  <button key={s} onClick={() => setStatus(s)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border capitalize transition-colors ${
                      status === s ? (s === 'published' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400') : 'text-[#555] hover:text-white'
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
