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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-base" style={{ color: 'var(--adm-text)' }}>Curriculum</h2>
        {isEnrolled && totalLessons > 0 && (
          <span className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{doneLessons} / {totalLessons} completed</span>
        )}
      </div>

      {topics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <BookOpen size={24} className="text-[#333] mb-3" />
          <p className="text-sm" style={{ color: 'var(--adm-muted)' }}>No lessons yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {topics.map((topic) => {
            const open = openId === topic.id;
            return (
              <div key={topic.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
                <button
                  onClick={() => setOpenId(open ? null : topic.id)}
                  className="w-full flex items-center gap-3 p-5 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>{topic.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--adm-muted)' }}>{topic.lessons.length} lesson{topic.lessons.length === 1 ? '' : 's'}</p>
                  </div>
                  <CaretDown size={14} style={{ color: 'var(--adm-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {open && (
                  <div className="border-t flex flex-col" style={{ borderColor: 'var(--adm-border)' }}>
                    {topic.lessons.map((lesson) => {
                      const meta = LESSON_META[lesson.type];
                      const Icon = meta.icon;
                      const isDone = completed.has(lesson.id);
                      const content = (
                        <>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>
                            <Icon size={13} weight="bold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate" style={{ color: 'var(--adm-text)' }}>{lesson.title || lessonSummary(lesson)}</p>
                            <p className="text-[11px]" style={{ color: 'var(--adm-muted)' }}>{meta.label}</p>
                          </div>
                          {isDone && <CheckCircle size={15} weight="fill" className="text-green-400 shrink-0" />}
                          {!isEnrolled && <Lock size={13} style={{ color: 'var(--adm-muted)' }} />}
                        </>
                      );

                      return isEnrolled ? (
                        <Link key={lesson.id} href={`/home/courses/${courseId}/lessons/${lesson.id}`}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                          {content}
                        </Link>
                      ) : (
                        <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 opacity-60 cursor-not-allowed">
                          {content}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
