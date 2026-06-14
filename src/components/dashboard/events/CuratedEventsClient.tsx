'use client';

import { useState } from 'react';
import { Star, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Item = { id: string; title: string; type: string; date: string; featured: boolean; };

const INIT: Item[] = [
  { id: '1', title: 'Community Building Q&A Live Session', type: 'Webinar', date: '2026-06-18', featured: true },
  { id: '3', title: 'Monthly Member Masterclass', type: 'Masterclass', date: '2026-06-10', featured: true },
  { id: '4', title: 'Course Creator Networking Night', type: 'Networking', date: '2026-06-25', featured: false },
];

export function CuratedEventsClient() {
  const [items, setItems] = useState(INIT);

  function toggle(id: string) {
    setItems((prev) => prev.map((e) => e.id === id ? { ...e, featured: !e.featured } : e));
  }

  return (
    <SectionLayout
      title="Curated Events"
      subtitle="Featured events shown on the homepage"
      cta={{ label: 'Add Event', onClick: () => {} }}
      stats={[
        { label: 'Featured', value: items.filter((e) => e.featured).length },
        { label: 'Selected', value: items.length },
      ]}
    >
      <div className="flex flex-col gap-3">
        {items.map((e) => (
          <div key={e.id} className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <button onClick={() => toggle(e.id)} className={`p-2 rounded-xl transition-colors ${e.featured ? 'bg-[#DC5B17]/20 text-[#DC5B17]' : 'bg-white/5 text-[#444] hover:text-white'}`}>
              <Star size={16} weight={e.featured ? 'fill' : 'regular'} />
            </button>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{e.title}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--adm-muted)' }}>
                {e.type} · {new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <button onClick={() => setItems((prev) => prev.filter((x) => x.id !== e.id))} className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}>
              <Trash size={14} />
            </button>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
