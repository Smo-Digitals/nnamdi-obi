'use client';

import { SectionLayout } from '../SectionLayout';
import { EmptyChart } from '@/components/dashboard/EmptyChart';

const TOP = [
  { title: 'Community Building Masterclass', students: 342 },
  { title: 'Online Course Creation Bootcamp', students: 218 },
  { title: 'Marketing Fundamentals', students: 156 },
  { title: 'Productivity Hacks for Entrepreneurs', students: 89 },
];

export function CourseMetricsClient() {
  return (
    <SectionLayout
      title="Course Metrics"
      subtitle="Enrollment, completion, and revenue analytics"
      stats={[
        { label: 'Total Students', value: '850', sub: '+12% this month' },
        { label: 'Avg. Completion', value: '68%' },
        { label: 'Avg. Rating', value: '★ 4.6' },
        { label: 'Revenue', value: '₦2.1M' },
      ]}
    >
      <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--adm-text)' }}>Enrollments Over Time</p>
          <EmptyChart />
        </div>
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--adm-text)' }}>Top Courses</p>
          <div className="flex flex-col gap-4">
            {TOP.map((c) => (
              <div key={c.title}>
                <p className="text-xs font-medium truncate mb-1.5" style={{ color: 'var(--adm-text)' }}>{c.title}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/5">
                    <div className="h-1.5 rounded-full bg-[#DC5B17]" style={{ width: `${(c.students / 342) * 100}%` }} />
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--adm-muted)' }}>{c.students}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
