'use client';

import { ReactNode } from 'react';
import { Plus } from 'phosphor-react';

interface Stat { label: string; value: string | number; sub?: string; }

interface Props {
  title: string;
  subtitle?: string;
  cta?: { label: string; onClick: () => void; };
  stats?: Stat[];
  filters?: string[];
  active?: string;
  onFilter?: (f: string) => void;
  children: ReactNode;
}

export function SectionLayout({ title, subtitle, cta, stats, filters, active, onFilter, children }: Props) {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>{title}</h1>
          {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--adm-muted)' }}>{subtitle}</p>}
        </div>
        {cta && (
          <button
            onClick={cta.onClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#DC5B17] text-white text-sm font-semibold rounded-xl hover:bg-[#c44f13] transition-colors"
          >
            <Plus size={15} weight="bold" />
            {cta.label}
          </button>
        )}
      </div>

      {stats && (
        <div
          style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 16 }}
          className="mb-6"
        >
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--adm-muted)' }}>{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--adm-text)' }}>{s.value}</p>
              {s.sub && <p className="text-xs mt-0.5 text-green-400">{s.sub}</p>}
            </div>
          ))}
        </div>
      )}

      {filters && (
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ backgroundColor: 'var(--adm-card)' }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => onFilter?.(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                active === f ? 'bg-[#DC5B17] text-white' : 'text-[#555] hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
