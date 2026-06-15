'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Course = {
  id: string; title: string; description: string | null;
  cover_image_url: string | null; price: number | null; status: string;
};

type CuratedRow = {
  id: string; course_id: string; position: number; added_at: string;
  course: Course;
};

function formatPrice(p: number | null) {
  if (!p || p === 0) return 'Free';
  return `₦${p.toLocaleString()}`;
}

function CourseThumbnail({ url, size }: { url: string | null; size: number }) {
  return (
    <div style={{ width: size, height: size }}
      className="rounded-xl shrink-0 overflow-hidden bg-white/5 flex items-center justify-center">
      {url ? (
        <Image src={url} alt="" width={size} height={size} className="w-full h-full object-cover" unoptimized />
      ) : (
        <svg width={size * 0.4} height={size * 0.4} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
          style={{ color: 'var(--adm-border)' }}>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      )}
    </div>
  );
}

export function CuratedCoursesClient() {
  const [curated,   setCurated]   = useState<CuratedRow[]>([]);
  const [allCourses, setAll]      = useState<Course[]>([]);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [adding,    setAdding]    = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/curated/courses').then((r) => r.json()),
      fetch('/api/courses').then((r) => r.json()),
    ]).then(([cur, courses]) => {
      if (Array.isArray(cur))     setCurated(cur);
      if (Array.isArray(courses)) setAll(courses.filter((c: Course) => c.status === 'published'));
    }).finally(() => setLoading(false));
  }, []);

  const curatedIds = new Set(curated.map((r) => r.course_id));

  const available = allCourses.filter((c) =>
    !curatedIds.has(c.id) &&
    (!search || c.title.toLowerCase().includes(search.toLowerCase()))
  );

  async function addCourse(courseId: string) {
    setAdding(courseId);
    const r = await fetch('/api/curated/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: courseId }),
    });
    const d = await r.json();
    if (!d.error) setCurated((prev) => [...prev, d]);
    setAdding(null);
  }

  async function remove(id: string) {
    if (!confirm('Remove this course from curated?')) return;
    setCurated((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/curated/courses/${id}`, { method: 'DELETE' });
  }

  async function move(id: string, dir: 'up' | 'down') {
    const idx = curated.findIndex((r) => r.id === id);
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === curated.length - 1)) return;
    const next = [...curated];
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    const reordered = next.map((r, i) => ({ ...r, position: i }));
    setCurated(reordered);
    await Promise.all([
      fetch(`/api/curated/courses/${next[idx].id}`,  { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ position: idx }) }),
      fetch(`/api/curated/courses/${next[swap].id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ position: swap }) }),
    ]);
  }

  return (
    <div className="p-8 flex gap-8 items-start">

      {/* Left: browse + add */}
      <div className="w-72 shrink-0 sticky top-8">
        <h2 className="text-base font-bold mb-1" style={{ color: 'var(--adm-text)' }}>Add a Course</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--adm-muted)' }}>Pick from your published courses</p>

        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses…"
          className="w-full px-3 py-2 text-sm rounded-xl border outline-none mb-3"
          style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }} />

        <div className="flex flex-col gap-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {loading ? (
            <p className="text-xs text-center py-4" style={{ color: 'var(--adm-muted)' }}>Loading…</p>
          ) : available.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: 'var(--adm-muted)' }}>
              {allCourses.length === 0 ? 'No published courses yet' : 'All courses are already curated'}
            </p>
          ) : available.map((c) => (
            <div key={c.id} className="rounded-xl border p-3 flex items-center gap-3 transition-colors hover:border-[#DC5B17]/40"
              style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
              <CourseThumbnail url={c.cover_image_url} size={40} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: 'var(--adm-text)' }}>{c.title}</p>
                <p className="text-[11px]" style={{ color: 'var(--adm-muted)' }}>{formatPrice(c.price)}</p>
              </div>
              <button onClick={() => addCourse(c.id)} disabled={adding === c.id}
                className="shrink-0 w-6 h-6 rounded-lg bg-[#DC5B17]/10 hover:bg-[#DC5B17] hover:text-white text-[#DC5B17] transition-colors flex items-center justify-center disabled:opacity-40">
                {adding === c.id
                  ? <span className="text-[10px]">…</span>
                  : <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right: curated list */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--adm-text)' }}>Curated Courses</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--adm-muted)' }}>
              {loading ? '…' : `${curated.length} course${curated.length !== 1 ? 's' : ''} featured`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2].map((i) => (
              <div key={i} className="h-24 rounded-2xl border animate-pulse"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }} />
            ))}
          </div>
        ) : curated.length === 0 ? (
          <div className="rounded-2xl border py-16 text-center"
            style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <p className="text-sm" style={{ color: 'var(--adm-muted)' }}>No curated courses yet — add one from the left.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {curated.map((row, i) => (
              <div key={row.id} className="rounded-2xl border flex items-center gap-4 p-4"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>

                {/* Position badge */}
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold"
                  style={{ backgroundColor: 'var(--adm-bg)', color: 'var(--adm-muted)' }}>
                  {i + 1}
                </div>

                <CourseThumbnail url={row.course.cover_image_url} size={52} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--adm-text)' }}>{row.course.title}</p>
                  {row.course.description && (
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--adm-muted)' }}>{row.course.description}</p>
                  )}
                  <p className="text-xs mt-1 font-medium" style={{ color: '#DC5B17' }}>{formatPrice(row.course.price)}</p>
                </div>

                {/* Reorder + remove */}
                <div className="flex flex-col items-center gap-0.5 shrink-0">
                  <button onClick={() => move(row.id, 'up')} disabled={i === 0}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-20"
                    style={{ color: 'var(--adm-muted)' }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>
                  </button>
                  <button onClick={() => move(row.id, 'down')} disabled={i === curated.length - 1}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-20"
                    style={{ color: 'var(--adm-muted)' }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                </div>
                <button onClick={() => remove(row.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors shrink-0"
                  style={{ color: 'var(--adm-muted)' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
