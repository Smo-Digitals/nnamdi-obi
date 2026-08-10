'use client';

import { GridFour, List as ListIcon } from 'phosphor-react';
import { type ViewMode } from './announcementUtils';

interface Props {
  mode:     ViewMode;
  onChange: (m: ViewMode) => void;
}

const OPTIONS: { mode: ViewMode; icon: typeof GridFour; label: string }[] = [
  { mode: 'grid', icon: GridFour, label: 'Grid view' },
  { mode: 'list', icon: ListIcon, label: 'List view' },
];

export function ViewToggle({ mode, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 rounded-xl border p-1" style={{ borderColor: 'var(--adm-border)' }}>
      {OPTIONS.map(({ mode: m, icon: Icon, label }) => (
        <button
          key={m}
          type="button"
          aria-label={label}
          aria-pressed={mode === m}
          onClick={() => onChange(m)}
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
          style={{
            backgroundColor: mode === m ? 'color-mix(in srgb, #DC5B17 15%, transparent)' : 'transparent',
            color:           mode === m ? '#DC5B17' : 'var(--adm-muted)',
          }}
        >
          <Icon size={16} weight={mode === m ? 'fill' : 'regular'} />
        </button>
      ))}
    </div>
  );
}
