'use client';

import { ToggleLeft, ToggleRight, Gift, Package, ChalkboardTeacher, GraduationCap } from 'phosphor-react';
import { RichTextEditor } from '../RichTextEditor';
import type { Course } from './courseTypes';

interface Props { course: Course; onChange: (patch: Partial<Course>) => void }

export function CaptionTab({ course, onChange }: Props) {
  const inputCls = 'w-full px-4 py-3 rounded-xl border bg-transparent text-sm outline-none focus:border-[#DC5B17] transition-colors';
  const style = { color: 'var(--adm-text)', borderColor: 'var(--adm-border)' };
  const cardCls = 'rounded-2xl border p-5';
  const cardStyle = { backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' };

  function SectionLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
    return (
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(220,91,23,0.12)', color: '#DC5B17' }}>
          <Icon size={14} weight="bold" />
        </div>
        <label className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{children}</label>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className={cardCls} style={cardStyle}>
        <SectionLabel icon={Gift}>What You&apos;d Get</SectionLabel>
        <RichTextEditor value={course.what_youd_get} onChange={(html) => onChange({ what_youd_get: html })} />
      </div>

      <div className={cardCls} style={cardStyle}>
        <SectionLabel icon={Package}>Materials Needed</SectionLabel>
        <RichTextEditor value={course.materials_needed} onChange={(html) => onChange({ materials_needed: html })} />
      </div>

      <div className={cardCls} style={cardStyle}>
        <SectionLabel icon={ChalkboardTeacher}>Instructor</SectionLabel>
        <input value={course.instructor ?? ''} onChange={(e) => onChange({ instructor: e.target.value || null })}
          placeholder="Instructor name" className={inputCls} style={style} />
      </div>

      <div className={cardCls} style={cardStyle}>
        <SectionLabel icon={GraduationCap}>Certification</SectionLabel>
        <button onClick={() => onChange({ certification: !course.certification })}
          className={`hover-brighten flex items-center gap-2 transition-colors ${course.certification ? 'text-green-400' : 'text-[#555]'}`}>
          {course.certification ? <ToggleRight size={26} weight="fill" /> : <ToggleLeft size={26} />}
          <span className="text-xs font-medium" style={{ color: 'var(--adm-text)' }}>
            {course.certification ? 'Learners get a certificate on completion' : 'No certificate for this course'}
          </span>
        </button>
      </div>
    </div>
  );
}
