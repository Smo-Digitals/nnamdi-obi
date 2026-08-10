'use client';

import { Check, CircleNotch } from 'phosphor-react';

interface Props {
  status: 'idle' | 'saving' | 'saved';
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function WizardActions({ status, label, onClick, disabled }: Props) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      {status !== 'idle' && (
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--adm-muted)' }}>
          {status === 'saving' ? <CircleNotch size={13} className="animate-spin" /> : <Check size={13} className="text-green-400" />}
          {status === 'saving' ? 'Saving…' : 'Saved'}
        </span>
      )}
      <button onClick={onClick} disabled={disabled || status === 'saving'}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-125 active:brightness-90 disabled:opacity-50"
        style={{
          background: 'var(--wizard-btn-bg)',
          boxShadow: 'var(--wizard-btn-shadow)',
          border: 'none',
          color: 'var(--wizard-btn-text)',
        }}>
        {label}
      </button>
    </div>
  );
}
