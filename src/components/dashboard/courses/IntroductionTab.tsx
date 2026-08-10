'use client';

import { useState } from 'react';
import { RichTextEditor } from '../RichTextEditor';
import { ImageDropzone } from './ImageDropzone';
import { VideoUrlCard } from './VideoUrlCard';
import type { Course, Difficulty, SessionType } from './courseTypes';

interface Props { course: Course; onChange: (patch: Partial<Course>) => void }

const CATEGORIES = ['Community', 'Education', 'Finance', 'Marketing', 'Productivity', 'Tech'];
const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: 'beginner', label: 'Beginner', color: '#16a34a' },
  { value: 'intermediate', label: 'Intermediate', color: '#d97706' },
  { value: 'advanced', label: 'Advanced', color: '#dc2626' },
];
const SESSION_TYPES: { value: SessionType; label: string; color: string }[] = [
  { value: 'live', label: 'Live', color: '#e11d48' },
  { value: 'pre_recorded', label: 'Pre Recorded', color: '#2563eb' },
  { value: 'recording', label: 'Recording', color: '#7c3aed' },
];

export function IntroductionTab({ course, onChange }: Props) {
  const [tagsDraft, setTagsDraft] = useState(course.tags.join(', '));

  const inputCls = 'w-full px-4 py-3 rounded-xl border bg-transparent text-sm outline-none focus:border-[#DC5B17] transition-colors';
  const style = { color: 'var(--adm-text)', borderColor: 'var(--adm-border)' };
  const labelCls = 'text-xs font-semibold mb-2 block';
  const cardCls = 'rounded-2xl border p-4';
  const cardStyle = { backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' };

  function commitTags() {
    onChange({ tags: tagsDraft.split(',').map((t) => t.trim()).filter(Boolean) });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
      <div className="flex flex-col gap-6 min-w-0">
        <div>
          <label className={labelCls} style={{ color: 'var(--adm-muted)' }}>Course Title</label>
          <input value={course.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="ex. Learn Photoshop CS6 from scratch"
            className={`${inputCls} text-base font-medium`} style={style} />
        </div>

        <div>
          <label className={labelCls} style={{ color: 'var(--adm-muted)' }}>Course Description</label>
          <RichTextEditor value={course.description ?? ''} onChange={(html) => onChange({ description: html })} />
        </div>

        <div className={cardCls} style={cardStyle}>
          <label className={labelCls} style={{ color: 'var(--adm-muted)' }}>Difficulty</label>
          <div className="flex gap-2 mb-4">
            {DIFFICULTIES.map((d) => (
              <button key={d.value} onClick={() => onChange({ difficulty: d.value })}
                className="hover-brighten flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors"
                style={course.difficulty === d.value
                  ? { backgroundColor: d.color, borderColor: d.color, color: '#fff' }
                  : { borderColor: 'var(--adm-border)', color: 'var(--adm-muted)' }}>
                {d.label}
              </button>
            ))}
          </div>

          <label className={labelCls} style={{ color: 'var(--adm-muted)' }}>Type</label>
          <div className="flex gap-2">
            {SESSION_TYPES.map((t) => (
              <button key={t.value} onClick={() => onChange({ session_type: t.value })}
                className="hover-brighten flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors"
                style={course.session_type === t.value
                  ? { backgroundColor: t.color, borderColor: t.color, color: '#fff' }
                  : { borderColor: 'var(--adm-border)', color: 'var(--adm-muted)' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: 'var(--adm-muted)' }}>Category</label>
            <select value={course.category ?? ''} onChange={(e) => onChange({ category: e.target.value || null })}
              className={inputCls} style={style}>
              <option value="">Choose a category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} style={{ color: 'var(--adm-muted)' }}>Tags</label>
            <input value={tagsDraft} onChange={(e) => setTagsDraft(e.target.value)} onBlur={commitTags}
              placeholder="Write words separated by comas" className={inputCls} style={style} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 min-w-0">
        <div className={cardCls} style={cardStyle}>
          <label className={labelCls} style={{ color: 'var(--adm-muted)' }}>Thumbnail / Feature Image</label>
          <ImageDropzone url={course.cover_image_url} onChange={(url) => onChange({ cover_image_url: url })} />
        </div>

        <div className={cardCls} style={cardStyle}>
          <label className={labelCls} style={{ color: 'var(--adm-muted)' }}>Intro Video</label>
          <VideoUrlCard url={course.intro_video_url ?? null} onChange={(url) => onChange({ intro_video_url: url })} />
        </div>
      </div>
    </div>
  );
}
