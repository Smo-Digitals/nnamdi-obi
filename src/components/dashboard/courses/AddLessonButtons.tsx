'use client';

import { Plus } from 'phosphor-react';
import { LESSON_META } from './lessonMeta';
import type { LessonType } from './courseTypes';

interface Props { onSelect: (type: LessonType) => void }

export function AddLessonButtons({ onSelect }: Props) {
  return (
    <div className="flex gap-2">
      {(Object.keys(LESSON_META) as LessonType[]).map((t) => {
        const meta = LESSON_META[t];
        const Icon = meta.icon;
        return (
          <button key={t} onClick={() => onSelect(t)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors hover:bg-white/5"
            style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }}>
            <Plus size={12} weight="bold" />
            <Icon size={13} weight="bold" style={{ color: meta.color }} />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
