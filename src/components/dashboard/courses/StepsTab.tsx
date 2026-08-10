'use client';

import { useState, useEffect, useRef } from 'react';
import { Reorder } from 'framer-motion';
import { Plus } from 'phosphor-react';
import { StepAccordion, type SaveStatus } from './StepAccordion';
import type { Step } from './roadmapTypes';

const SAVE_DELAY = 600;

export function StepsTab({ roadmapId }: { roadmapId: string }) {
  const [steps,   setSteps]   = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [status,  setStatus]  = useState<Record<string, SaveStatus>>({});
  const [newestId, setNewestId] = useState<string | null>(null);

  const stepsRef = useRef(steps);
  useEffect(() => { stepsRef.current = steps; }, [steps]);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const reorderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(`/api/roadmaps/${roadmapId}/steps`)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setSteps(d); })
      .finally(() => setLoading(false));
  }, [roadmapId]);

  async function persistStep(id: string) {
    const step = stepsRef.current.find((s) => s.id === id);
    if (!step) return;
    setStatus((s) => ({ ...s, [id]: 'saving' }));
    await fetch(`/api/roadmap-steps/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: step.title, description: step.description, blocks: step.blocks }),
    });
    setStatus((s) => ({ ...s, [id]: 'saved' }));
    setTimeout(() => setStatus((s) => ({ ...s, [id]: 'idle' })), 1500);
  }

  function updateStep(id: string, patch: Partial<Step>) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    clearTimeout(saveTimers.current[id]);
    saveTimers.current[id] = setTimeout(() => persistStep(id), SAVE_DELAY);
  }

  async function addStep() {
    const res = await fetch(`/api/roadmaps/${roadmapId}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled Step', description: null, blocks: [] }),
    });
    const step = await res.json();
    setSteps((prev) => [...prev, step]);
    setNewestId(step.id);
  }

  async function deleteStep(id: string) {
    if (!confirm('Delete this step? This cannot be undone.')) return;
    clearTimeout(saveTimers.current[id]);
    setSteps((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/roadmap-steps/${id}`, { method: 'DELETE' });
  }

  function reorderSteps(next: Step[]) {
    setSteps(next);
    if (reorderTimer.current) clearTimeout(reorderTimer.current);
    reorderTimer.current = setTimeout(() => {
      fetch(`/api/roadmaps/${roadmapId}/steps/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: stepsRef.current.map((s) => s.id) }),
      });
    }, 500);
  }

  if (loading) return null;

  return (
    <div className="flex flex-col gap-3">
      {steps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--adm-text)' }}>No steps yet</p>
          <p className="text-xs mb-5" style={{ color: 'var(--adm-muted)' }}>Add the first step of this roadmap</p>
          <button onClick={addStep} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">
            <Plus size={14} weight="bold" /> Add Step
          </button>
        </div>
      ) : (
        <Reorder.Group as="div" axis="y" values={steps} onReorder={reorderSteps} className="flex flex-col gap-3">
          {steps.map((s) => (
            <StepAccordion
              key={s.id}
              step={s}
              status={status[s.id] ?? 'idle'}
              autoFocus={s.id === newestId}
              onChange={(patch) => updateStep(s.id, patch)}
              onDelete={() => deleteStep(s.id)}
            />
          ))}
        </Reorder.Group>
      )}

      {steps.length > 0 && (
        <button onClick={addStep}
          className="flex items-center justify-center gap-1.5 py-3 rounded-2xl border border-dashed text-sm font-semibold transition-colors hover:bg-white/5"
          style={{ color: 'var(--adm-muted)', borderColor: 'var(--adm-border)' }}>
          <Plus size={14} weight="bold" /> Add Step
        </button>
      )}
    </div>
  );
}
