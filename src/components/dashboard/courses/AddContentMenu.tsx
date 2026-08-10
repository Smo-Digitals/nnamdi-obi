'use client';

import { useState } from 'react';
import { Plus, CaretDown } from 'phosphor-react';
import { BLOCK_META } from './blockMeta';
import type { BlockType } from './roadmapTypes';

interface Props { onSelect: (type: BlockType) => void }

export function AddContentMenu({ onSelect }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors hover:bg-white/5"
        style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }}>
        <Plus size={13} weight="bold" /> Add Content <CaretDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 z-20 w-44 rounded-xl border overflow-hidden shadow-xl"
            style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            {(Object.keys(BLOCK_META) as BlockType[]).map((t) => {
              const meta = BLOCK_META[t];
              const Icon = meta.icon;
              return (
                <button key={t} onClick={() => { onSelect(t); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs font-medium hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--adm-text)' }}>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>
                    <Icon size={12} weight="bold" />
                  </div>
                  {meta.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
