'use client';

import { ChartLine } from 'phosphor-react';

export function EmptyChart() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 text-center">
      <div
        className="w-12 h-12 rounded-2xl border flex items-center justify-center mb-3"
        style={{ backgroundColor: 'var(--adm-pill)', borderColor: 'var(--adm-border)' }}
      >
        <ChartLine size={20} style={{ color: 'var(--adm-muted)' }} />
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--adm-text)' }}>No data yet</p>
      <p className="text-xs mt-1" style={{ color: 'var(--adm-muted)' }}>Chart will populate as members join</p>
    </div>
  );
}
