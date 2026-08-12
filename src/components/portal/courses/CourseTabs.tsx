'use client';

import { useState } from 'react';
import { CourseAbout } from './CourseAbout';

type Tab = 'overview' | 'author' | 'faq' | 'announcements' | 'reviews';
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'author', label: 'Author' },
  { id: 'faq', label: 'FAQ' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'reviews', label: 'Reviews' },
];

interface Props {
  description: string | null;
  whatYoudGet: string;
  materialsNeeded: string;
  instructor: string | null;
}

export function CourseTabs({ description, whatYoudGet, materialsNeeded, instructor }: Props) {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="mt-6">
      <div className="flex items-center gap-6 border-b mb-6" style={{ borderColor: 'var(--adm-border)' }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="relative pb-3 text-sm font-semibold"
            style={{ color: tab === t.id ? 'var(--adm-text)' : 'var(--adm-muted)' }}>
            {t.label}
            {tab === t.id && <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full" style={{ backgroundColor: '#DC5B17' }} />}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
        {tab === 'overview' && <CourseAbout description={description} whatYoudGet={whatYoudGet} materialsNeeded={materialsNeeded} />}

        {tab === 'author' && (
          instructor ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0" style={{ backgroundColor: 'rgba(220,91,23,0.15)', color: '#DC5B17' }}>
                {instructor.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>{instructor}</p>
                <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>Instructor</p>
              </div>
            </div>
          ) : <EmptyTab text="No instructor info yet." />
        )}

        {tab === 'faq' && <EmptyTab text="No FAQs yet." />}
        {tab === 'announcements' && <EmptyTab text="No announcements yet." />}
        {tab === 'reviews' && <EmptyTab text="No reviews yet." />}
      </div>
    </div>
  );
}

function EmptyTab({ text }: { text: string }) {
  return <p className="text-sm text-center py-8" style={{ color: 'var(--adm-muted)' }}>{text}</p>;
}
