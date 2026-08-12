import Link from 'next/link';
import { Users, PlayCircle } from 'phosphor-react';
import type { CourseCardData } from './courseCardTypes';
import { categoryMeta, ctaLabel } from './courseCardTypes';

export function CourseCardCinematic({ course }: { course: CourseCardData }) {
  const meta = categoryMeta(course.category);
  const Icon = meta.icon;

  return (
    <Link href={`/home/courses/${course.id}`}
      className="group flex flex-col rounded-2xl border p-4 hover:border-white/20 transition-colors"
      style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>

      <div className="relative h-36 rounded-2xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: meta.color }}>
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
          {course.category ?? 'Course'}
        </span>
        <Icon size={48} weight="bold" className="text-white/90 group-hover:scale-110 transition-transform duration-300" />
      </div>

      <div className="pt-4 flex flex-col gap-2">
        <h2 className="font-bold text-base leading-snug line-clamp-2" style={{ color: 'var(--adm-text)' }}>{course.title}</h2>
        {course.description && <p className="text-xs line-clamp-2" style={{ color: 'var(--adm-muted)' }}>{course.description}</p>}

        {course.isEnrolled ? (
          <div className="mt-1">
            <div className="flex items-center justify-between text-[11px] mb-1" style={{ color: 'var(--adm-muted)' }}>
              <span>Progress</span>
              <span className="font-semibold" style={{ color: 'var(--adm-text)' }}>{course.progressPct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--adm-border)' }}>
              <div className="h-full rounded-full" style={{ width: `${course.progressPct}%`, backgroundColor: '#4ade80' }} />
            </div>
          </div>
        ) : (
          <span className="text-sm font-bold mt-1" style={{ color: 'var(--adm-text)' }}>
            {course.sale_price != null ? (
              <>₦{course.sale_price.toLocaleString()} <span className="line-through font-normal text-xs" style={{ color: 'var(--adm-muted)' }}>₦{course.price.toLocaleString()}</span></>
            ) : course.price === 0 ? 'Free' : `₦${course.price.toLocaleString()}`}
          </span>
        )}

        <div className="flex items-center justify-between mt-1 text-[11px]" style={{ color: 'var(--adm-muted)' }}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><PlayCircle size={13} />{course.lessonCount} lessons</span>
            <span className="flex items-center gap-1"><Users size={13} />{course.enrolledCount}</span>
          </div>
          <span className="font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#DC5B17' }}>{ctaLabel(course)} →</span>
        </div>
      </div>
    </Link>
  );
}
