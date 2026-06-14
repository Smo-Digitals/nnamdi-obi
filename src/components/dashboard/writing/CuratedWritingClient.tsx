'use client';

import { useState } from 'react';
import { PushPin, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Item = { id: string; title: string; category: string; views: number; pinned: boolean; };

const INIT: Item[] = [
  { id: '1', title: 'How to build a successful community online', category: 'Community', views: 2840, pinned: true },
  { id: '4', title: 'Building in public: lessons from year one', category: 'Personal', views: 4100, pinned: true },
  { id: '2', title: 'The complete guide to online courses', category: 'Courses', views: 1920, pinned: false },
];

export function CuratedWritingClient() {
  const [items, setItems] = useState(INIT);

  function toggle(id: string) {
    setItems((prev) => prev.map((p) => p.id === id ? { ...p, pinned: !p.pinned } : p));
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <SectionLayout
      title="Curated Posts"
      subtitle="Hand-pick posts to feature on the homepage"
      cta={{ label: 'Add Post', onClick: () => {} }}
      stats={[
        { label: 'Featured', value: items.filter((p) => p.pinned).length },
        { label: 'Selected', value: items.length },
      ]}
    >
      <div className="flex flex-col gap-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <button
              onClick={() => toggle(p.id)}
              className={`p-2 rounded-xl transition-colors ${p.pinned ? 'bg-[#DC5B17]/20 text-[#DC5B17]' : 'bg-white/5 text-[#444] hover:text-white'}`}
            >
              <PushPin size={16} weight={p.pinned ? 'fill' : 'regular'} />
            </button>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{p.title}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--adm-muted)' }}>{p.category} · {p.views.toLocaleString()} views</p>
            </div>
            <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}>
              <Trash size={14} />
            </button>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
