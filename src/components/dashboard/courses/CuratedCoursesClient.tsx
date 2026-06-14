'use client';

import { useState } from 'react';
import { Star, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Item = { id: string; title: string; category: string; students: number; featured: boolean; };

const INIT: Item[] = [
  { id: '1', title: 'Community Building Masterclass', category: 'Community', students: 342, featured: true },
  { id: '5', title: 'Productivity Hacks for Entrepreneurs', category: 'Productivity', students: 89, featured: true },
  { id: '2', title: 'Online Course Creation Bootcamp', category: 'Education', students: 218, featured: false },
];

export function CuratedCoursesClient() {
  const [items, setItems] = useState(INIT);

  function toggle(id: string) {
    setItems((prev) => prev.map((c) => c.id === id ? { ...c, featured: !c.featured } : c));
  }

  return (
    <SectionLayout
      title="Curated Courses"
      subtitle="Featured courses shown on the homepage"
      cta={{ label: 'Add Course', onClick: () => {} }}
      stats={[
        { label: 'Featured', value: items.filter((c) => c.featured).length },
        { label: 'Selected', value: items.length },
      ]}
    >
      <div className="flex flex-col gap-3">
        {items.map((c) => (
          <div key={c.id} className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <button
              onClick={() => toggle(c.id)}
              className={`p-2 rounded-xl transition-colors ${c.featured ? 'bg-[#DC5B17]/20 text-[#DC5B17]' : 'bg-white/5 text-[#444] hover:text-white'}`}
            >
              <Star size={16} weight={c.featured ? 'fill' : 'regular'} />
            </button>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{c.title}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--adm-muted)' }}>{c.category} · {c.students.toLocaleString()} students</p>
            </div>
            <button onClick={() => setItems((prev) => prev.filter((x) => x.id !== c.id))} className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}>
              <Trash size={14} />
            </button>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
