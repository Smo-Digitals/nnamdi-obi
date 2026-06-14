'use client';

import { useState } from 'react';
import { PencilSimple, Trash } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type Category = { id: string; name: string; courses: number; students: number; };

const MOCK: Category[] = [
  { id: '1', name: 'Community', courses: 2, students: 342 },
  { id: '2', name: 'Education', courses: 1, students: 218 },
  { id: '3', name: 'Finance', courses: 2, students: 156 },
  { id: '4', name: 'Marketing', courses: 1, students: 156 },
  { id: '5', name: 'Productivity', courses: 1, students: 89 },
  { id: '6', name: 'Tech', courses: 1, students: 45 },
];

export function CourseCategoriesClient() {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  return (
    <SectionLayout
      title="Course Categories"
      subtitle="Organise courses by topic"
      cta={{ label: 'Add Category', onClick: () => setAdding(true) }}
      stats={[
        { label: 'Categories', value: MOCK.length },
        { label: 'Total Courses', value: MOCK.reduce((s, c) => s + c.courses, 0) },
        { label: 'Total Students', value: MOCK.reduce((s, c) => s + c.students, 0).toLocaleString() },
      ]}
    >
      {adding && (
        <div className="rounded-2xl border p-4 mb-4 flex items-center gap-3" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Category name..." className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40" style={{ color: 'var(--adm-text)' }} />
          <button onClick={() => { setAdding(false); setNewName(''); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#DC5B17] text-white">Add</button>
          <button onClick={() => { setAdding(false); setNewName(''); }} className="text-xs" style={{ color: 'var(--adm-muted)' }}>Cancel</button>
        </div>
      )}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['Name', 'Courses', 'Students', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK.map((c, i) => (
              <tr key={c.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                <td className="px-4 py-3.5 text-sm font-medium" style={{ color: 'var(--adm-text)' }}>{c.name}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{c.courses}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{c.students.toLocaleString()}</td>
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
