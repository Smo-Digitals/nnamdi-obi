'use client';

import { useState, useRef, useEffect } from 'react';
import { DotsSixVertical } from 'phosphor-react';

interface Props {
  onConfirm: (title: string, description: string) => void;
  onCancel: () => void;
}

export function TopicDraftCard({ onConfirm, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { titleRef.current?.focus(); }, []);

  const style = { color: 'var(--adm-text)', borderColor: 'var(--adm-border)' };

  function confirm() {
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    onConfirm(title.trim(), description.trim());
  }

  return (
    <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: '#DC5B17', backgroundColor: 'var(--adm-card)' }}>
      <div className="flex items-start gap-3 px-5 py-4">
        <DotsSixVertical size={18} weight="bold" className="mt-2.5 shrink-0" style={{ color: 'var(--adm-border)' }} />
        <div className="flex-1 flex flex-col gap-2.5 min-w-0">
          <input ref={titleRef} value={title} onChange={(e) => setTitle(e.target.value)} disabled={submitting}
            onKeyDown={(e) => { if (e.key === 'Enter') confirm(); }}
            placeholder="Add a title" className="w-full bg-transparent text-sm font-semibold outline-none disabled:opacity-60" style={style} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} disabled={submitting}
            placeholder="Add a summary"
            className="w-full px-3 py-2 rounded-lg border bg-transparent text-xs outline-none focus:border-[#DC5B17] transition-colors resize-none disabled:opacity-60"
            style={style} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 px-5 py-3 border-t" style={{ borderColor: 'var(--adm-border)' }}>
        <button onClick={onCancel} disabled={submitting}
          className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors hover:text-white disabled:opacity-40" style={{ color: 'var(--adm-muted)' }}>
          Cancel
        </button>
        <button onClick={confirm} disabled={!title.trim() || submitting}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#DC5B17] text-white text-xs font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-40">
          {submitting && <span className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
          {submitting ? 'Adding…' : 'Ok'}
        </button>
      </div>
    </div>
  );
}
