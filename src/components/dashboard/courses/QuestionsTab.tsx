'use client';

import { useState, useEffect } from 'react';
import { Trash, Plus } from 'phosphor-react';

type Question = { id: string; roadmap_id: string; question: string; sort_order: number };

export function QuestionsTab({ roadmapId }: { roadmapId: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading,    setLoading]  = useState(true);
  const [draft,      setDraft]    = useState('');
  const [adding,     setAdding]   = useState(false);

  function load() {
    fetch(`/api/roadmaps/${roadmapId}/questions`)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setQuestions(d); })
      .finally(() => setLoading(false));
  }
  useEffect(load, [roadmapId]);

  async function addQuestion() {
    if (!draft.trim()) return;
    setAdding(true);
    const res = await fetch(`/api/roadmaps/${roadmapId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: draft.trim() }),
    });
    const q = await res.json();
    setQuestions((prev) => [...prev, q]);
    setDraft('');
    setAdding(false);
  }

  async function updateQuestion(id: string, question: string) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, question } : q)));
    await fetch(`/api/roadmap-questions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
  }

  async function removeQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    await fetch(`/api/roadmap-questions/${id}`, { method: 'DELETE' });
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border bg-transparent text-sm outline-none focus:border-[#DC5B17] transition-colors';
  const style = { color: 'var(--adm-text)', borderColor: 'var(--adm-border)' };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs mb-1" style={{ color: 'var(--adm-muted)' }}>
        Applicants must answer these before they can access this roadmap. You review and approve or reject each application.
      </p>

      {!loading && questions.map((q, i) => (
        <div key={q.id} className="flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: 'var(--adm-border)' }}>
          <span className="text-xs font-bold shrink-0" style={{ color: 'var(--adm-muted)' }}>{i + 1}.</span>
          <input value={q.question} onChange={(e) => updateQuestion(q.id, e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none" style={{ color: 'var(--adm-text)' }} />
          <button onClick={() => removeQuestion(q.id)} className="text-[#555] hover:text-red-400 transition-colors shrink-0"><Trash size={14} /></button>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addQuestion(); }}
          placeholder="Add a qualifying question…"
          className={inputCls} style={style}
        />
        <button onClick={addQuestion} disabled={adding || !draft.trim()}
          className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-50 shrink-0">
          <Plus size={14} weight="bold" /> Add
        </button>
      </div>
    </div>
  );
}
