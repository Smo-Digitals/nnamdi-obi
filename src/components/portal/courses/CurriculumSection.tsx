'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CaretDown, Lock, BookOpen, CheckCircle } from 'phosphor-react';
import { LESSON_META, lessonSummary } from '@/components/dashboard/courses/lessonMeta';
import type { Lesson } from '@/components/dashboard/courses/courseTypes';

type Topic = {
  id: string; title: string; description: string | null; sort_order: number; lessons: Lesson[];
};

interface Props { courseId: string; topics: Topic[]; isEnrolled: boolean; completedLessonIds: string[] }

export function CurriculumSection({ courseId, topics, isEnrolled, completedLessonIds }: Props) {
  const [openId, setOpenId] = useState<string | null>(topics[0]?.id ?? null);
  const completed = new Set(completedLessonIds);
  const totalLessons = topics.reduce((n, t) => n + t.lessons.length, 0);
  const doneLessons = topics.reduce((n, t) => n + t.lessons.filter((l) => completed.has(l.id)).length, 0);

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--adm-border)' }}>
        <h2 className="font-bold text-base" style={{ color: 'var(--adm-text)' }}>Course content</h2>
        {isEnrolled && totalLessons > 0 && (
          <span className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{doneLessons}/{totalLessons} done</span>
        )}
      </div>

      {topics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <BookOpen size={24} className="text-[#333] mb-3" />
          <p className="text-sm" style={{ color: 'var(--adm-muted)' }}>No lessons yet.</p>
        </div>
      ) : (
        topics.map((topic, ti) => {
          const open = openId === topic.id;
          return (
            <div key={topic.id} style={{ borderTop: ti > 0 ? '1px solid var(--adm-border)' : undefined }}>
              <button onClick={() => setOpenId(open ? null : topic.id)} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
                <span className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>
                  {String(ti + 1).padStart(2, '0')}: {topic.title}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs" style={{ color: 'var(--adm-muted)' }}>{topic.lessons.length} lesson{topic.lessons.length === 1 ? '' : 's'}</span>
                  <div className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: 'var(--adm-border)' }}>
                    <CaretDown size={11} style={{ color: 'var(--adm-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                </div>
              </button>

              {open && (
                <div className="flex flex-col" style={{ backgroundColor: 'var(--adm-surface)' }}>
                  {topic.lessons.map((lesson) => {
                    const meta = LESSON_META[lesson.type];
                    const Icon = meta.icon;
                    const isDone = completed.has(lesson.id);
                    const content = (
                      <>
                        <Icon size={15} weight="bold" style={{ color: meta.color }} className="shrink-0" />
                        <span className="flex-1 min-w-0 truncate text-sm" style={{ color: 'var(--adm-text)' }}>{lesson.title || lessonSummary(lesson)}</span>
                        <span className="text-xs shrink-0" style={{ color: 'var(--adm-muted)' }}>{meta.label}</span>
                        {isDone && <CheckCircle size={15} weight="fill" className="text-green-400 shrink-0" />}
                        {!isEnrolled && <Lock size={13} style={{ color: 'var(--adm-muted)' }} className="shrink-0" />}
                      </>
                    );
                    return isEnrolled ? (
                      <Link key={lesson.id} href={`/home/courses/${courseId}/lessons/${lesson.id}`}
                        className="flex items-center gap-3 pl-9 pr-5 py-2.5 hover:bg-black/[0.02] transition-colors">
                        {content}
                      </Link>
                    ) : (
                      <div key={lesson.id} className="flex items-center gap-3 pl-9 pr-5 py-2.5 opacity-60 cursor-not-allowed">
                        {content}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
