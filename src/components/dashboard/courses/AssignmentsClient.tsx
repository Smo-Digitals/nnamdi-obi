'use client';

import { useState } from 'react';
import { Plus, PencilSimple, Users, CalendarBlank } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';
import { AssignmentPanel, type Assignment } from './AssignmentPanel';

type Course = { id: string; title: string };

interface Props { assignments: Assignment[]; courses: Course[] }

const STATUS_STYLE = {
  draft:     'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  published: 'text-green-400 bg-green-400/10 border-green-400/20',
};

export function AssignmentsClient({ assignments: initial, courses }: Props) {
  const [list,    setList]    = useState(initial);
  const [panel,   setPanel]   = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);

  function openCreate() { setEditing(null); setPanel(true); }
  function openEdit(a: Assignment) { setEditing(a); setPanel(true); }

  function onSaved(a: Assignment) {
    setList((prev) => {
      const idx = prev.findIndex((x) => x.id === a.id);
      if (idx !== -1) { const next = [...prev]; next[idx] = a; return next; }
      return [a, ...prev];
    });
    setPanel(false);
  }

  function onDeleted(id: string) { setList((prev) => prev.filter((a) => a.id !== id)); setPanel(false); }

  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c.title]));
  const published = list.filter((a) => a.status === 'published').length;
  const totalMax  = list.reduce((s, a) => s + a.rubric.reduce((r, i) => r + i.max_score, 0), 0);

  return (
    <>
      <AssignmentPanel open={panel} onClose={() => setPanel(false)} editing={editing} courses={courses} onSaved={onSaved} onDeleted={onDeleted} />
      <SectionLayout
        title="Assignments"
        subtitle="Manage peer-reviewed assignments across all courses"
        cta={{ label: 'New Assignment', onClick: openCreate }}
        stats={[
          { label: 'Total',     value: list.length },
          { label: 'Published', value: published },
          { label: 'Courses',   value: courses.length },
          { label: 'Max Score', value: totalMax > 0 ? `${totalMax} pts` : '—' },
        ]}
      >
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border"
            style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--adm-text)' }}>No assignments yet</p>
            <p className="text-xs mb-5" style={{ color: 'var(--adm-muted)' }}>Create your first assignment to get started</p>
            <button onClick={openCreate} className="px-5 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">
              New Assignment
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
                  {['Title', 'Course', 'Due Date', 'Reviews Req.', 'Max Score', 'Status', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((a, i) => (
                  <tr key={a.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                    <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{a.title}</td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{courseMap[a.course_id] ?? '—'}</td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>
                      {a.due_date ? (
                        <span className="flex items-center gap-1"><CalendarBlank size={12} />{new Date(a.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>
                      <span className="flex items-center gap-1"><Users size={12} />{a.reviews_required}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold" style={{ color: 'var(--adm-text)' }}>
                      {a.rubric.reduce((s, r) => s + r.max_score, 0)} pts
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize ${STATUS_STYLE[a.status]}`}>{a.status}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}>
                        <PencilSimple size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionLayout>
    </>
  );
}
