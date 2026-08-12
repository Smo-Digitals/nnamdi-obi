'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CaretLeft, CaretRight, CheckCircle, Circle } from 'phosphor-react';
import { LESSON_META } from '@/components/dashboard/courses/lessonMeta';
import type { Lesson } from '@/components/dashboard/courses/courseTypes';
import { LessonBody } from './LessonBody';

interface Props {
  courseId:           string;
  courseTitle:        string;
  topicTitle:         string;
  lesson:             Lesson;
  prevId:             string | null;
  nextId:             string | null;
  initiallyCompleted: boolean;
}

export function PortalLessonClient({ courseId, courseTitle, topicTitle, lesson, prevId, nextId, initiallyCompleted }: Props) {
  const meta = LESSON_META[lesson.type];
  const Icon = meta.icon;
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [saving, setSaving] = useState(false);

  async function toggleComplete() {
    setSaving(true);
    const next = !completed;
    const res = await fetch('/api/lesson-completions', {
      method: next ? 'POST' : 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next ? { course_id: courseId, lesson_id: lesson.id } : { lesson_id: lesson.id }),
    });
    setSaving(false);
    if (res.ok) setCompleted(next);
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href={`/home/courses/${courseId}`} className="inline-flex items-center gap-1.5 text-xs font-semibold mb-6 transition-colors" style={{ color: 'var(--adm-muted)' }}>
        <ArrowLeft size={13} weight="bold" /> {courseTitle}
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>
          <Icon size={13} weight="bold" />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: meta.color }}>{topicTitle}</p>
      </div>

      {lesson.title && <h1 className="font-bold text-2xl mb-6" style={{ color: 'var(--adm-text)' }}>{lesson.title}</h1>}

      <LessonBody lesson={lesson} />

      <button
        onClick={toggleComplete}
        disabled={saving}
        className="inline-flex items-center gap-1.5 text-xs font-semibold mb-6 disabled:opacity-50 transition-colors"
        style={{ color: completed ? '#4ade80' : 'var(--adm-muted)' }}
      >
        {completed
          ? <CheckCircle size={15} weight="fill" />
          : <Circle size={15} />}
        {completed ? 'Completed' : 'Mark as complete'}
      </button>

      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--adm-border)' }}>
        {prevId ? (
          <Link href={`/home/courses/${courseId}/lessons/${prevId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--adm-text)' }}>
            <CaretLeft size={13} weight="bold" /> Previous
          </Link>
        ) : <span />}
        {nextId ? (
          <Link href={`/home/courses/${courseId}/lessons/${nextId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-[#DC5B17] text-white hover:bg-[#c44f13] transition-colors">
            Next lesson <CaretRight size={13} weight="bold" />
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
