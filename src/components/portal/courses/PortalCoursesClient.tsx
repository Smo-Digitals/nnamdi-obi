'use client';

import Link from 'next/link';
import { BookOpen, ArrowRight } from 'phosphor-react';

type Course = { id: string; title: string; description: string | null; cover_image_url: string | null; price: number };

interface Props { courses: Course[] }

export function PortalCoursesClient({ courses }: Props) {
  if (courses.length === 0) {
    return (
      <div className="p-8">
        <h1 className="font-bold text-2xl mb-1" style={{ color: 'var(--adm-text)' }}>Courses</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--adm-muted)' }}>All available courses.</p>
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <BookOpen size={28} className="text-[#333] mb-3" />
          <p className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>No courses yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--adm-muted)' }}>Check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl mb-1" style={{ color: 'var(--adm-text)' }}>Courses</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--adm-muted)' }}>{courses.length} course{courses.length !== 1 ? 's' : ''} available</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <Link key={c.id} href={`/home/courses/${c.id}`}
            className="group flex flex-col rounded-2xl border overflow-hidden hover:border-white/15 transition-colors"
            style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            {c.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.cover_image_url} alt={c.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-36 flex items-center justify-center" style={{ backgroundColor: 'var(--adm-bg)' }}>
                <BookOpen size={32} className="text-[#333]" />
              </div>
            )}
            <div className="p-4 flex flex-col gap-2">
              <h2 className="font-bold text-sm" style={{ color: 'var(--adm-text)' }}>{c.title}</h2>
              {c.description && <p className="text-xs line-clamp-2" style={{ color: 'var(--adm-muted)' }}>{c.description}</p>}
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-semibold" style={{ color: 'var(--adm-text)' }}>
                  {c.price === 0 ? 'Free' : `₦${c.price.toLocaleString()}`}
                </span>
                <ArrowRight size={13} className="text-[#DC5B17] opacity-0 group-hover:opacity-100 transition-opacity" weight="bold" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
