import Link from 'next/link';
import { BookOpen, Users, PlayCircle } from 'phosphor-react';
import type { CourseCardData } from './courseCardTypes';
import { categoryMeta, ctaLabel } from './courseCardTypes';

export function CourseCardCinematic({ course }: { course: CourseCardData }) {
  const meta = categoryMeta(course.category);
  const showProgress = course.isEnrolled;

  return (
    <Link href={`/home/courses/${course.id}`}
      className="group relative flex flex-col h-64 rounded-2xl overflow-hidden border hover:border-white/20 transition-colors"
      style={{ borderColor: 'var(--adm-border)' }}>
      {course.cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={course.cover_image_url} alt={course.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--adm-bg)' }}>
          <BookOpen size={32} className="text-[#333]" />
        </div>
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 5%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.05) 75%)' }} />

      <div className="relative mt-auto p-4 flex flex-col gap-2">
        <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm"
          style={{ backgroundColor: `${meta.color}33`, color: meta.color }}>
          {course.category ?? 'Course'}
        </span>

        <h2 className="font-bold text-lg text-white leading-snug line-clamp-2">{course.title}</h2>
        {course.description && <p className="text-xs text-white/70 line-clamp-2">{course.description}</p>}

        {showProgress ? (
          <div className="mt-1">
            <div className="flex items-center justify-between text-[11px] text-white/70 mb-1">
              <span>Progress</span>
              <span className="font-semibold text-white">{course.progressPct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${course.progressPct}%`, backgroundColor: '#4ade80' }} />
            </div>
          </div>
        ) : (
          <span className="text-sm font-bold text-white mt-1">
            {course.sale_price != null ? (
              <>₦{course.sale_price.toLocaleString()} <span className="text-white/50 line-through font-normal">₦{course.price.toLocaleString()}</span></>
            ) : course.price === 0 ? 'Free' : `₦${course.price.toLocaleString()}`}
          </span>
        )}

        <div className="flex items-center justify-between mt-1 text-[11px] text-white/60">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><PlayCircle size={13} />{course.lessonCount} lessons</span>
            <span className="flex items-center gap-1"><Users size={13} />{course.enrolledCount}</span>
          </div>
          <span className="font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">{ctaLabel(course)} →</span>
        </div>
      </div>
    </Link>
  );
}
