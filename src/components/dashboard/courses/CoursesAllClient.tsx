'use client';

import { useState } from 'react';
import { Eye, PencilSimple, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Status = 'published' | 'draft' | 'archived';
type Course = { id: string; title: string; category: string; students: number; price: number; status: Status; rating: number; };

const MOCK: Course[] = [
  { id: '1', title: 'Community Building Masterclass', category: 'Community', students: 342, price: 49000, status: 'published', rating: 4.8 },
  { id: '2', title: 'Online Course Creation Bootcamp', category: 'Education', students: 218, price: 35000, status: 'published', rating: 4.6 },
  { id: '3', title: 'Financial Literacy for Creators', category: 'Finance', students: 0, price: 29000, status: 'draft', rating: 0 },
  { id: '4', title: 'Marketing Fundamentals', category: 'Marketing', students: 156, price: 19000, status: 'published', rating: 4.4 },
  { id: '5', title: 'Productivity Hacks for Entrepreneurs', category: 'Productivity', students: 89, price: 25000, status: 'published', rating: 4.7 },
  { id: '6', title: 'Tech for Non-Tech Founders', category: 'Tech', students: 45, price: 39000, status: 'archived', rating: 4.2 },
];

const S: Record<Status, string> = {
  published: 'text-green-400 bg-green-400/10 border-green-400/20',
  draft:     'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  archived:  'text-[#555] bg-white/5 border-white/10',
};

export function CoursesAllClient() {
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? MOCK : MOCK.filter((c) => c.status === filter);
  const naira = (n: number) => `₦${(n / 100).toLocaleString()}`;

  return (
    <SectionLayout
      title="All Courses"
      subtitle="Manage your course catalogue"
      cta={{ label: 'New Course', onClick: () => {} }}
      stats={[
        { label: 'Total', value: MOCK.length },
        { label: 'Published', value: MOCK.filter((c) => c.status === 'published').length },
        { label: 'Students', value: MOCK.reduce((s, c) => s + c.students, 0).toLocaleString() },
        { label: 'Revenue', value: '₦2.1M' },
      ]}
      filters={['all', 'published', 'draft', 'archived']}
      active={filter}
      onFilter={setFilter}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Title', 'Category', 'Students', 'Price', 'Rating', 'Status', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={c.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 max-w-xs"><p className="text-sm font-medium truncate" style={{ color: 'var(--adm-text)' }}>{c.title}</p></td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{c.category}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{c.students.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{naira(c.price)}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{c.rating > 0 ? `★ ${c.rating}` : '—'}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${S[c.status]}`}>{c.status}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5 justify-end">
                    <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><Eye size={14} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><PencilSimple size={14} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}><Trash size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionLayout>
  );
}
