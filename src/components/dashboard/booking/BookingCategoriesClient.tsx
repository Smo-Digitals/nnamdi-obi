'use client';

import { useState } from 'react';
import { PencilSimple, Trash, ToggleLeft, ToggleRight } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Service = { id: string; name: string; duration: string; price: number; bookings: number; active: boolean; };

const MOCK: Service[] = [
  { id: '1', name: '1:1 Strategy Call', duration: '60 min', price: 50000, bookings: 32, active: true },
  { id: '2', name: 'Business Audit', duration: '90 min', price: 75000, bookings: 14, active: true },
  { id: '3', name: 'Course Consultation', duration: '45 min', price: 30000, bookings: 8, active: true },
  { id: '4', name: 'Brand Review', duration: '60 min', price: 45000, bookings: 5, active: false },
  { id: '5', name: 'Group Workshop', duration: '120 min', price: 25000, bookings: 3, active: true },
];

const naira = (n: number) => `₦${n.toLocaleString()}`;

export function BookingCategoriesClient() {
  const [services, setServices] = useState(MOCK);

  function toggleActive(id: string) {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  }

  return (
    <SectionLayout
      title="Booking Services"
      subtitle="Manage your bookable services and session types"
      cta={{ label: 'New Service', onClick: () => {} }}
      stats={[
        { label: 'Total Services', value: services.length },
        { label: 'Active', value: services.filter((s) => s.active).length },
        { label: 'Total Bookings', value: services.reduce((s, x) => s + x.bookings, 0) },
      ]}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Service', 'Duration', 'Price', 'Bookings', 'Active', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={s.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 text-sm font-medium" style={{ color: 'var(--adm-text)' }}>{s.name}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{s.duration}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{naira(s.price)}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{s.bookings}</td>
                <td className="px-4 py-3.5">
                  <button onClick={() => toggleActive(s.id)} className={`transition-colors ${s.active ? 'text-green-400' : 'text-[#333]'}`}>
                    {s.active ? <ToggleRight size={22} weight="fill" /> : <ToggleLeft size={22} />}
                  </button>
                </td>
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
