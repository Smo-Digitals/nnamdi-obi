import Link from 'next/link';
import { Users, PlayCircle } from 'phosphor-react';
import type { CourseCardData } from './courseCardTypes';
import { categoryMeta, ctaLabel, pastelFor } from './courseCardTypes';

export function CourseCardCinematic({ course, index }: { course: CourseCardData; index: number }) {
  const meta = categoryMeta(course.category);
  const Icon = meta.icon;
  const box = pastelFor(index);

  return (
    <Link href={`/home/courses/${course.id}`}
      className="group flex flex-col rounded-[32px] p-4 bg-white shadow-sm hover:shadow-md transition-shadow">

      <div className="relative h-40 rounded-[22px] flex items-center justify-center overflow-hidden" style={{ backgroundColor: box }}>
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
          style={{ backgroundColor: 'rgba(255,255,255,0.55)', color: '#1a1a1a' }}>
          {course.category ?? 'Course'}
        </span>
        <Icon size={44} weight="bold" style={{ color: meta.color }} className="group-hover:scale-110 transition-transform duration-300" />
      </div>

      <div className="pt-4 flex flex-col gap-2">
        <h2 className="font-bold text-base leading-snug line-clamp-2" style={{ color: '#111' }}>{course.title}</h2>
        {course.description && <p className="text-xs line-clamp-2" style={{ color: 'rgba(0,0,0,0.55)' }}>{course.description}</p>}

        {course.isEnrolled ? (
          <div className="mt-1">
            <div className="flex items-center justify-between text-[11px] mb-1" style={{ color: 'rgba(0,0,0,0.5)' }}>
              <span>Progress</span>
              <span className="font-semibold" style={{ color: '#111' }}>{course.progressPct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <div className="h-full rounded-full" style={{ width: `max(${course.progressPct}%, 12px)`, backgroundColor: '#111' }} />
            </div>
          </div>
        ) : (
          <span className="text-sm font-bold mt-1" style={{ color: '#111' }}>
            {course.sale_price != null ? (
              <>₦{course.sale_price.toLocaleString()} <span className="line-through font-normal text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>₦{course.price.toLocaleString()}</span></>
            ) : course.price === 0 ? 'Free' : `₦${course.price.toLocaleString()}`}
          </span>
        )}

        <div className="flex items-center justify-between mt-1 text-[11px]" style={{ color: 'rgba(0,0,0,0.5)' }}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><PlayCircle size={13} />{course.lessonCount} lessons</span>
            <span className="flex items-center gap-1"><Users size={13} />{course.enrolledCount}</span>
          </div>
          <span className="font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: meta.color }}>{ctaLabel(course)} →</span>
        </div>
      </div>
    </Link>
  );
}
