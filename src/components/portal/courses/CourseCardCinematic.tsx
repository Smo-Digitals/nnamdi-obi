import Link from 'next/link';
import { Briefcase, BookOpen } from 'phosphor-react';
import type { CourseCardData } from './courseCardTypes';
import { categoryMeta, ctaLabel, pastelFor } from './courseCardTypes';

export function CourseCardCinematic({ course, index }: { course: CourseCardData; index: number }) {
  const meta = categoryMeta(course.category);
  const box = pastelFor(index);
  const completedLessons = Math.round((course.progressPct / 100) * course.lessonCount);

  const displayPrice = course.sale_price ?? course.price;
  const footer = course.isEnrolled
    ? { label: 'Lessons: ', value: `${completedLessons}/${course.lessonCount}` }
    : { label: 'Price: ', value: displayPrice === 0 ? 'Free' : `₦${displayPrice.toLocaleString()}` };

  return (
    <Link href={`/home/courses/${course.id}`} className="group flex flex-col rounded-[28px] p-2 border shadow-sm hover:shadow-md transition-shadow"
      style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
      <div className="relative rounded-[22px] p-5" style={{ backgroundColor: box }}>
        <div className="flex items-start justify-between">
          <span className="px-3.5 py-2 rounded-full text-sm" style={{ backgroundColor: `${meta.color}22`, color: '#120f0f' }}>
            {course.category ?? 'Course'}
          </span>
          <BookOpen size={26} style={{ color: meta.color }} />
        </div>

        <h2 className="text-2xl mt-5 mb-2 line-clamp-2" style={{ color: '#111' }}>{course.title}</h2>
        {course.description && <p className="text-sm line-clamp-2 mb-4" style={{ color: '#5d5959' }}>{course.description}</p>}

        <div className="flex items-center gap-6 mb-5 text-sm" style={{ color: '#4f4a4a' }}>
          <span className="flex items-center gap-2"><Briefcase size={20} />{course.lessonCount} Lessons</span>
          <span className="flex items-center gap-2"><Briefcase size={20} />{course.topicCount} Topics</span>
        </div>

        <p className="text-sm mb-2" style={{ color: '#5d5959' }}>Progress</p>
        <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}>
          <div className="h-2 rounded-full" style={{ width: `max(${course.progressPct}%, 10px)`, backgroundColor: '#111' }} />
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <span className="text-sm" style={{ color: 'var(--adm-text)' }}>
          {footer.label}<span className="font-bold">{footer.value}</span>
        </span>
        <span className="px-6 py-3 rounded-full text-sm font-medium transition-opacity group-hover:opacity-85"
          style={{ backgroundColor: 'var(--adm-text)', color: 'var(--adm-card)' }}>
          {ctaLabel(course)}
        </span>
      </div>
    </Link>
  );
}
