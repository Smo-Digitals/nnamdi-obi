'use client';

import { BookOpen } from 'phosphor-react';
import type { CourseCardData } from './courseCardTypes';
import { CourseCardCinematic } from './CourseCardCinematic';

interface Props { courses: CourseCardData[] }

export function PortalCoursesClient({ courses }: Props) {
  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl mb-1" style={{ color: 'var(--adm-text)' }}>Courses</h1>
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
          {courses.map((c, i) => <CourseCardCinematic key={c.id} course={c} index={i} />)}
        </div>
      )}
    </div>
  );
}
