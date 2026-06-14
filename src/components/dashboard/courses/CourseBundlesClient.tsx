'use client';

import { PencilSimple, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Bundle = { id: string; name: string; courses: number; originalPrice: number; bundlePrice: number; students: number; active: boolean; };

const MOCK: Bundle[] = [
  { id: '1', name: 'Creator Starter Pack', courses: 3, originalPrice: 93000, bundlePrice: 65000, students: 124, active: true },
  { id: '2', name: 'Finance & Growth Bundle', courses: 2, originalPrice: 68000, bundlePrice: 49000, students: 87, active: true },
  { id: '3', name: 'Complete Mastery Bundle', courses: 6, originalPrice: 196000, bundlePrice: 120000, students: 43, active: false },
];

const naira = (n: number) => `₦${(n / 100).toLocaleString()}`;

export function CourseBundlesClient() {
  return (
    <SectionLayout
      title="Course Bundles"
      subtitle="Group courses into discounted packages"
      cta={{ label: 'New Bundle', onClick: () => {} }}
      stats={[
        { label: 'Total Bundles', value: MOCK.length },
        { label: 'Active', value: MOCK.filter((b) => b.active).length },
        { label: 'Bundle Students', value: MOCK.reduce((s, b) => s + b.students, 0) },
      ]}
    >
      <div className="flex flex-col gap-3">
        {MOCK.map((b) => (
          <div key={b.id} className="rounded-2xl border p-5 flex items-center gap-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{b.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${b.active ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-[#555] bg-white/5 border-white/10'}`}>
                  {b.active ? 'active' : 'inactive'}
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>{b.courses} courses · {b.students} students enrolled</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold" style={{ color: 'var(--adm-text)' }}>{naira(b.bundlePrice)}</p>
              <p className="text-xs line-through" style={{ color: 'var(--adm-muted)' }}>{naira(b.originalPrice)}</p>
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
