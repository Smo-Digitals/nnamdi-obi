'use client';

import { useState, useEffect, useRef } from 'react';
import { Reorder } from 'framer-motion';
import { Plus, Rocket } from 'phosphor-react';
import { TopicAccordion, type SaveStatus } from './TopicAccordion';
import { TopicDraftCard } from './TopicDraftCard';
import { LiveClassesSection } from './LiveClassesSection';
import type { SessionType, Topic } from './courseTypes';

const SAVE_DELAY = 600;

export function CurriculumTab({ courseId, sessionType }: { courseId: string; sessionType?: SessionType }) {
  const [topics,  setTopics]  = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [status,  setStatus]  = useState<Record<string, SaveStatus>>({});
  const [newestId, setNewestId] = useState<string | null>(null);
  const [drafting, setDrafting] = useState(false);

  const topicsRef = useRef(topics);
  useEffect(() => { topicsRef.current = topics; }, [topics]);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const reorderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(`/api/courses/${courseId}/topics`)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setTopics(d); })
      .finally(() => setLoading(false));
  }, [courseId]);

  async function persistTopic(id: string) {
    const topic = topicsRef.current.find((t) => t.id === id);
    if (!topic) return;
    setStatus((s) => ({ ...s, [id]: 'saving' }));
    await fetch(`/api/course-topics/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: topic.title, description: topic.description, lessons: topic.lessons, resources: topic.resources }),
    });
    setStatus((s) => ({ ...s, [id]: 'saved' }));
    setTimeout(() => setStatus((s) => ({ ...s, [id]: 'idle' })), 1500);
  }

  function updateTopic(id: string, patch: Partial<Topic>) {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    clearTimeout(saveTimers.current[id]);
    saveTimers.current[id] = setTimeout(() => persistTopic(id), SAVE_DELAY);
  }

  async function confirmDraft(title: string, description: string) {
    const res = await fetch(`/api/courses/${courseId}/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: description || null, lessons: [] }),
    });
    const topic = await res.json();
    setTopics((prev) => [...prev, topic]);
    setNewestId(topic.id);
    setDrafting(false);
  }

  async function duplicateTopic(topic: Topic) {
    const res = await fetch(`/api/courses/${courseId}/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: `${topic.title} (Copy)`, description: topic.description, lessons: topic.lessons, resources: topic.resources }),
    });
    const copy = await res.json();
    const idx = topics.findIndex((t) => t.id === topic.id);
    setTopics((prev) => [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)]);
  }

  async function deleteTopic(id: string) {
    if (!confirm('Delete this topic? This cannot be undone.')) return;
    clearTimeout(saveTimers.current[id]);
    setTopics((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/course-topics/${id}`, { method: 'DELETE' });
  }

  function reorderTopics(next: Topic[]) {
    setTopics(next);
    if (reorderTimer.current) clearTimeout(reorderTimer.current);
    reorderTimer.current = setTimeout(() => {
      fetch(`/api/courses/${courseId}/topics/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: topicsRef.current.map((t) => t.id) }),
      });
    }, 500);
  }

  if (loading) return null;

  return (
    <div className="flex flex-col gap-3">
      {sessionType === 'live' && <LiveClassesSection courseId={courseId} />}

      {topics.length === 0 && !drafting && (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(220,91,23,0.12)', color: '#DC5B17' }}>
            <Rocket size={26} weight="bold" />
          </div>
          <p className="font-semibold text-base mb-1" style={{ color: 'var(--adm-text)' }}>Start building your course!</p>
          <p className="text-xs mb-6" style={{ color: 'var(--adm-muted)' }}>Add topics and lessons to get started.</p>
          <button onClick={() => setDrafting(true)} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">
            <Plus size={14} weight="bold" /> Add Topic
          </button>
        </div>
      )}

      {topics.length > 0 && (
        <Reorder.Group as="div" axis="y" values={topics} onReorder={reorderTopics} className="flex flex-col gap-3">
          {topics.map((t) => (
            <TopicAccordion
              key={t.id}
              topic={t}
              status={status[t.id] ?? 'idle'}
              autoFocus={t.id === newestId}
              onChange={(patch) => updateTopic(t.id, patch)}
              onDelete={() => deleteTopic(t.id)}
              onDuplicate={() => duplicateTopic(t)}
            />
          ))}
        </Reorder.Group>
      )}

      {drafting && <TopicDraftCard onConfirm={confirmDraft} onCancel={() => setDrafting(false)} />}

      {topics.length > 0 && !drafting && (
        <button onClick={() => setDrafting(true)}
          className="flex items-center justify-center gap-1.5 py-3 rounded-2xl border border-dashed text-sm font-semibold transition-colors hover:bg-white/5"
          style={{ color: 'var(--adm-muted)', borderColor: 'var(--adm-border)' }}>
          <Plus size={14} weight="bold" /> Add Topic
        </button>
      )}
    </div>
  );
}
