'use client';

import { PencilSimple, Trash, Path } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Roadmap = { id: string; name: string; steps: number; enrolled: number; duration: string; active: boolean; };

const MOCK: Roadmap[] = [
  { id: '1', name: 'From Zero to Creator', steps: 4, enrolled: 198, duration: '8 weeks', active: true },
  { id: '2', name: 'Business Growth Track', steps: 5, enrolled: 134, duration: '10 weeks', active: true },
  { id: '3', name: 'Community Leader Path', steps: 3, enrolled: 76, duration: '6 weeks', active: true },
  { id: '4', name: 'Financial Freedom Journey', steps: 4, enrolled: 0, duration: '8 weeks', active: false },
];

export function RoadmapsClient() {
  return (
    <SectionLayout
      title="Learning Roadmaps"
      subtitle="Structured learning paths combining multiple courses"
      cta={{ label: 'New Roadmap', onClick: () => {} }}
      stats={[
        { label: 'Total Roadmaps', value: MOCK.length },
        { label: 'Active', value: MOCK.filter((r) => r.active).length },
        { label: 'Enrolled', value: MOCK.reduce((s, r) => s + r.enrolled, 0) },
      ]}
    >
      <div className="flex flex-col gap-3">
        {MOCK.map((r) => (
          <div key={r.id} className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <div className={`p-2.5 rounded-xl ${r.active ? 'bg-[#DC5B17]/20 text-[#DC5B17]' : 'bg-white/5 text-[#444]'}`}>
              <Path size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{r.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${r.active ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-[#555] bg-white/5 border-white/10'}`}>
                  {r.active ? 'active' : 'inactive'}
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>{r.steps} steps · {r.duration} · {r.enrolled} enrolled</p>
            </div>
            <div className="flex gap-1.5">
              <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><PencilSimple size={14} /></button>
              <button className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}><Trash size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
