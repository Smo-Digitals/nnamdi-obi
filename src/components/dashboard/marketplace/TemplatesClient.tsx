'use client';

import { useState } from 'react';
import { PencilSimple, Trash, Eye } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Status = 'active' | 'draft' | 'archived';
type Template = { id: string; name: string; type: string; price: number; sales: number; rating: number; status: Status; };

const MOCK: Template[] = [
  { id: '1', name: 'Community Launch Kit', type: 'Design Pack', price: 9500, sales: 142, rating: 4.9, status: 'active' },
  { id: '2', name: 'Creator Business Plan', type: 'Document', price: 4500, sales: 89, rating: 4.7, status: 'active' },
  { id: '3', name: 'Email Sequence Templates', type: 'Copy Pack', price: 6500, sales: 67, rating: 4.5, status: 'active' },
  { id: '4', name: 'Social Media Content Calendar', type: 'Spreadsheet', price: 3500, sales: 0, rating: 0, status: 'draft' },
  { id: '5', name: 'Course Outline Template', type: 'Document', price: 2500, sales: 201, rating: 4.8, status: 'active' },
];

const S: Record<Status, string> = {
  active:   'text-green-400 bg-green-400/10 border-green-400/20',
  draft:    'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  archived: 'text-[#555] bg-white/5 border-white/10',
};

const naira = (n: number) => `₦${n.toLocaleString()}`;

export function TemplatesClient() {
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? MOCK : MOCK.filter((t) => t.status === filter);

  return (
    <SectionLayout
      title="Templates"
      subtitle="Digital templates and resources for sale"
      cta={{ label: 'New Template', onClick: () => {} }}
      stats={[
        { label: 'Total', value: MOCK.length },
        { label: 'Active', value: MOCK.filter((t) => t.status === 'active').length },
        { label: 'Total Sales', value: MOCK.reduce((s, t) => s + t.sales, 0) },
        { label: 'Revenue', value: '₦485K' },
      ]}
      filters={['all', 'active', 'draft', 'archived']}
      active={filter}
      onFilter={setFilter}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Name', 'Type', 'Price', 'Sales', 'Rating', 'Status', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => (
              <tr key={t.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 text-sm font-medium" style={{ color: 'var(--adm-text)' }}>{t.name}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{t.type}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{naira(t.price)}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{t.sales}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{t.rating > 0 ? `★ ${t.rating}` : '—'}</td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${S[t.status]}`}>{t.status}</span></td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5 justify-end">
                    <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><Eye size={14} /></button>
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
