'use client';

import { useState } from 'react';
import { BookOpen } from 'phosphor-react';
import type { CourseCardData } from './courseCardTypes';
import { CourseCardCinematic } from './CourseCardCinematic';
import { CourseCardInfo } from './CourseCardInfo';

type Style = 'cinematic' | 'info';

interface Props { courses: CourseCardData[] }

export function PortalCoursesClient({ courses }: Props) {
  const [style, setStyle] = useState<Style>('cinematic');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>Courses</h1>
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--adm-card)', border: '1px solid var(--adm-border)' }}>
          {(['cinematic', 'info'] as Style[]).map((s) => (
            <button key={s} onClick={() => setStyle(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors"
              style={{
                backgroundColor: style === s ? '#DC5B17' : 'transparent',
                color: style === s ? '#fff' : 'var(--adm-muted)',
              }}>
              {s === 'cinematic' ? 'Cinematic' : 'Info card'}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm mb-8" style={{ color: 'var(--adm-muted)' }}>{courses.length} course{courses.length !== 1 ? 's' : ''} available</p>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <BookOpen size={28} className="text-[#333] mb-3" />
          <p className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>No courses yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--adm-muted)' }}>Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c, i) => style === 'cinematic'
            ? <CourseCardCinematic key={c.id} course={c} index={i} />
            : <CourseCardInfo key={c.id} course={c} index={i} />)}
        </div>
      )}
    </div>
  );
}
