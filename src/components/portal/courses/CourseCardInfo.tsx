import Link from 'next/link';
import { PlayCircle, Users, Medal } from 'phosphor-react';
import type { CourseCardData } from './courseCardTypes';
import { categoryMeta, ctaLabel } from './courseCardTypes';

export function CourseCardInfo({ course }: { course: CourseCardData }) {
  const meta = categoryMeta(course.category);
  const Icon = meta.icon;

  return (
    <Link href={`/home/courses/${course.id}`}
      className="group flex flex-col p-5 rounded-2xl border hover:border-white/15 transition-colors"
      style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: `${meta.color}1f`, color: meta.color }}>
            {course.category ?? 'Course'}
          </span>
          {course.certification && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: 'rgba(250,204,21,0.12)', color: '#facc15' }}>
              <Medal size={11} weight="fill" /> Certificate
            </span>
          )}
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${meta.color}1f`, color: meta.color }}>
          <Icon size={17} weight="bold" />
        </div>
      </div>

      <h2 className="font-bold text-base mb-1" style={{ color: 'var(--adm-text)' }}>{course.title}</h2>
      {course.description && <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--adm-muted)' }}>{course.description}</p>}

      <div className="flex items-center gap-4 text-[11px] mb-4" style={{ color: 'var(--adm-muted)' }}>
        <span className="flex items-center gap-1"><PlayCircle size={13} />{course.lessonCount} lessons</span>
        <span className="flex items-center gap-1"><Users size={13} />{course.enrolledCount} enrolled</span>
        <span className="capitalize">{course.difficulty}</span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] mb-1" style={{ color: 'var(--adm-muted)' }}>
          <span>Progress</span>
          <span className="font-semibold" style={{ color: 'var(--adm-text)' }}>{course.progressPct}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--adm-border)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${course.progressPct}%`, backgroundColor: meta.color }} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--adm-border)' }}>
        <span className="text-sm font-bold" style={{ color: 'var(--adm-text)' }}>
          {course.sale_price != null ? (
            <>₦{course.sale_price.toLocaleString()} <span className="line-through font-normal text-[11px]" style={{ color: 'var(--adm-muted)' }}>₦{course.price.toLocaleString()}</span></>
          ) : course.price === 0 ? 'Free' : `₦${course.price.toLocaleString()}`}
        </span>
        <span className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white group-hover:bg-[#c44f13] transition-colors" style={{ backgroundColor: '#DC5B17' }}>
          {ctaLabel(course)}
        </span>
      </div>
    </Link>
  );
}
