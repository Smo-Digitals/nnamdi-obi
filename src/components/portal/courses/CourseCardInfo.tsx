import Link from 'next/link';
import { ClipboardText, Users } from 'phosphor-react';
import type { CourseCardData } from './courseCardTypes';
import { ctaLabel, pastelFor, badgeLabel } from './courseCardTypes';

export function CourseCardInfo({ course, index }: { course: CourseCardData; index: number }) {
  const bg = pastelFor(index);
  const displayPrice = course.sale_price ?? course.price;
  const footerLeft = course.isEnrolled
    ? `Lessons: ${Math.round((course.progressPct / 100) * course.lessonCount)}/${course.lessonCount}`
    : displayPrice === 0 ? 'Free' : `₦${displayPrice.toLocaleString()}`;

  return (
    <Link href={`/home/courses/${course.id}`} className="group flex flex-col rounded-[28px] overflow-hidden">
      <div className="relative p-7" style={{ backgroundColor: bg }}>
        <span className="inline-block px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(0,0,0,0.06)', color: '#1a1a1a' }}>
          {badgeLabel(course)}
        </span>

        {course.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.cover_image_url} alt="" aria-hidden
            className="absolute top-5 right-5 w-24 h-24 rounded-[40%] object-cover shadow-lg" />
        )}

        <h2 className="text-3xl font-bold mt-5 mb-3" style={{ color: '#111' }}>{course.title}</h2>
        {course.description && (
          <p className="text-base leading-snug mb-6 pr-24" style={{ color: 'rgba(0,0,0,0.55)' }}>{course.description}</p>
        )}

        <div className="flex items-center gap-2.5 mb-8 text-base font-medium" style={{ color: '#1a1a1a' }}>
          <ClipboardText size={20} />
          <span>{course.lessonCount} lessons</span>
          <span style={{ color: 'rgba(0,0,0,0.35)' }}>&bull;</span>
          <Users size={20} />
          <span>{course.enrolledCount} enrolled</span>
        </div>

        <div className="flex items-center justify-between text-base mb-2" style={{ color: 'rgba(0,0,0,0.6)' }}>
          <span>Progress</span>
          <span className="font-semibold" style={{ color: '#111' }}>{course.progressPct}%</span>
        </div>
        <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
          <div className="h-1.5 rounded-full" style={{ width: `max(${course.progressPct}%, 12px)`, backgroundColor: '#111' }} />
        </div>
      </div>

      <div className="flex items-center justify-between px-7 py-5 bg-white">
        <span className="text-base font-semibold" style={{ color: '#111' }}>
          {footerLeft}
          {!course.isEnrolled && course.sale_price != null && (
            <span className="ml-2 text-sm font-normal line-through" style={{ color: 'rgba(0,0,0,0.4)' }}>₦{course.price.toLocaleString()}</span>
          )}
        </span>
        <span className="px-6 py-3 rounded-full text-base font-semibold text-white transition-colors group-hover:bg-[#222]" style={{ backgroundColor: '#111' }}>
          {ctaLabel(course)}
        </span>
      </div>
    </Link>
  );
}
