'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PencilSimple, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';
import type { Course } from './courseTypes';

const S: Record<Course['status'], string> = {
  published: 'text-green-400 bg-green-400/10 border-green-400/20',
  draft:     'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  archived:  'text-[#555] bg-white/5 border-white/10',
};

export function CoursesAllClient() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');

  useEffect(() => {
    fetch('/api/courses')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setCourses(d); })
      .finally(() => setLoading(false));
  }, []);

  const rows = filter === 'all' ? courses : courses.filter((c) => c.status === filter);
  const naira = (n: number | null) => `₦${(n ?? 0).toLocaleString()}`;

  const stats = [
    { label: 'Total',     value: courses.length },
    { label: 'Published', value: courses.filter((c) => c.status === 'published').length },
    { label: 'Draft',     value: courses.filter((c) => c.status === 'draft').length },
    { label: 'Revenue',   value: naira(courses.reduce((s, c) => s + (c.price ?? 0), 0)) },
  ];

  return (
    <SectionLayout
      title="All Courses"
      subtitle="Manage your course catalogue"
      cta={{ label: 'New Course', onClick: () => router.push('/admin/courses/all/new') }}
      stats={stats}
      filters={['all', 'published', 'draft', 'archived']}
      active={filter}
      onFilter={setFilter}
    >
      {loading ? null : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--adm-text)' }}>No courses yet</p>
          <p className="text-xs mb-5" style={{ color: 'var(--adm-muted)' }}>Create your first course to get started</p>
          <button onClick={() => router.push('/admin/courses/all/new')} className="px-5 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">
            New Course
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
                {['Title', 'Price', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((c, i) => (
                <tr key={c.id} onClick={() => router.push(`/admin/courses/all/${c.id}`)}
                  className="cursor-pointer hover:bg-white/[0.03] transition-colors"
                  style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                  <td className="px-4 py-3.5 max-w-xs">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--adm-text)' }}>{c.title}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{naira(c.price)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${S[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1.5 justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/admin/courses/all/${c.id}?tab=introduction`); }}
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}
                      ><PencilSimple size={14} /></button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!confirm('Delete this course? This cannot be undone.')) return;
                          setCourses((prev) => prev.filter((x) => x.id !== c.id));
                          await fetch(`/api/courses/${c.id}`, { method: 'DELETE' });
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}
                      ><Trash size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionLayout>
  );
}
