'use client';

import { PencilSimple, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Status = 'active' | 'pending' | 'inactive';
type Partner = { id: string; brand: string; product: string; commission: number; clicks: number; conversions: number; status: Status; };

const MOCK: Partner[] = [
  { id: '1', brand: 'Notion', product: 'Notion for Teams', commission: 20, clicks: 340, conversions: 28, status: 'active' },
  { id: '2', brand: 'ConvertKit', product: 'Email Marketing Platform', commission: 30, clicks: 218, conversions: 19, status: 'active' },
  { id: '3', brand: 'Lemon Squeezy', product: 'Digital Commerce', commission: 15, clicks: 89, conversions: 6, status: 'pending' },
  { id: '4', brand: 'Typeform', product: 'Forms & Surveys', commission: 25, clicks: 12, conversions: 1, status: 'inactive' },
];

const S: Record<Status, string> = {
  active:   'text-green-400 bg-green-400/10 border-green-400/20',
  pending:  'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  inactive: 'text-[#555] bg-white/5 border-white/10',
};

export function PartnershipsClient() {
  return (
    <SectionLayout
      title="Partnerships"
      subtitle="Affiliate and partner product integrations"
      cta={{ label: 'Add Partner', onClick: () => {} }}
      stats={[
        { label: 'Total Partners', value: MOCK.length },
        { label: 'Active', value: MOCK.filter((p) => p.status === 'active').length },
        { label: 'Total Clicks', value: MOCK.reduce((s, p) => s + p.clicks, 0) },
        { label: 'Conversions', value: MOCK.reduce((s, p) => s + p.conversions, 0) },
      ]}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Brand', 'Product', 'Commission', 'Clicks', 'Conversions', 'Status', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK.map((p, i) => (
              <tr key={p.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 text-sm font-medium" style={{ color: 'var(--adm-text)' }}>{p.brand}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{p.product}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{p.commission}%</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{p.clicks}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{p.conversions}</td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${S[p.status]}`}>{p.status}</span></td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5 justify-end">
                    <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><PencilSimple size={14} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}><Trash size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionLayout>
  );
}
