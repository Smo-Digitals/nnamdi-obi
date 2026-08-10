'use client';

import { useState } from 'react';
import { Reorder, useDragControls, AnimatePresence, motion } from 'framer-motion';
import { Trash, CaretDown, DotsSixVertical } from 'phosphor-react';
import { RichTextEditor } from '../RichTextEditor';
import { FileUploadField } from './FileUploadField';
import { VideoUrlCard } from './VideoUrlCard';
import { QuizEditor } from './QuizEditor';
import { LESSON_META, lessonSummary } from './lessonMeta';
import type { Lesson } from './courseTypes';

interface Props {
  lesson: Lesson;
  onChange: (l: Lesson) => void;
  onRemove: () => void;
}

const fieldCls = 'w-full px-3 py-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-[#DC5B17] transition-colors';

export function LessonEditor({ lesson, onChange, onRemove }: Props) {
  const [open, setOpen] = useState(true);
  const controls = useDragControls();
  const set = (patch: Partial<Lesson>) => onChange({ ...lesson, ...patch });
  const style = { color: 'var(--adm-text)', borderColor: 'var(--adm-border)' };
  const meta = LESSON_META[lesson.type];
  const Icon = meta.icon;

  return (
    <Reorder.Item
      as="div"
      value={lesson}
      dragListener={false}
      dragControls={controls}
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-bg)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
      whileDrag={{ boxShadow: '0 12px 28px rgba(0,0,0,0.35)', scale: 1.01, zIndex: 10 }}
    >
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none" onClick={() => setOpen((o) => !o)}>
        <span onPointerDown={(e) => { e.stopPropagation(); controls.start(e); }} onClick={(e) => e.stopPropagation()}
          className="cursor-grab active:cursor-grabbing text-[#555] hover:text-white transition-colors shrink-0">
          <DotsSixVertical size={16} weight="bold" />
        </span>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>
          <Icon size={14} weight="bold" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: meta.color }}>{meta.label}</p>
          <p className="text-xs truncate" style={{ color: 'var(--adm-muted)' }}>{lessonSummary(lesson)}</p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-1 rounded-md text-[#555] hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0">
          <Trash size={14} />
        </button>
        <CaretDown size={13} className="shrink-0 transition-transform duration-200" style={{ color: 'var(--adm-muted)', transform: open ? 'rotate(180deg)' : 'none' }} />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 flex flex-col gap-2.5 border-t" style={{ borderColor: 'var(--adm-border)' }}>
              {lesson.type !== 'video' && (
                <input value={lesson.title} onChange={(e) => set({ title: e.target.value })} placeholder="Lesson title…"
                  className={fieldCls} style={style} />
              )}

              {lesson.type === 'text' && (
                <RichTextEditor value={lesson.content ?? ''} onChange={(html) => set({ content: html })} />
              )}

              {lesson.type === 'video' && (
                <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
                  <div className="flex flex-col gap-2.5">
                    <input value={lesson.title} onChange={(e) => set({ title: e.target.value })} placeholder="Lesson title…"
                      className={fieldCls} style={style} />
                    <textarea value={lesson.caption ?? ''} onChange={(e) => set({ caption: e.target.value })} rows={4}
                      placeholder="Description (optional)…" className={`${fieldCls} resize-none`} style={style} />
                  </div>
                  <div className="rounded-xl border p-3 flex flex-col gap-2" style={{ borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-card)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--adm-muted)' }}>Preview</p>
                    <VideoUrlCard url={lesson.video_url ?? null} onChange={(url) => set({ video_url: url ?? undefined })} />
                  </div>
                </div>
              )}

              {lesson.type === 'pdf' && (
                <FileUploadField url={lesson.pdf_url} onChange={(url) => set({ pdf_url: url })}
                  accept=".pdf,.epub" placeholder="Book / PDF URL…" />
              )}

              {lesson.type === 'assignment' && (
                <RichTextEditor value={lesson.assignment_instructions ?? ''} onChange={(html) => set({ assignment_instructions: html })} />
              )}

              {lesson.type === 'link' && (
                <>
                  <input value={lesson.link_title ?? ''} onChange={(e) => set({ link_title: e.target.value })}
                    placeholder="Link title…" className={fieldCls} style={style} />
                  <input value={lesson.link_url ?? ''} onChange={(e) => set({ link_url: e.target.value })}
                    placeholder="https://…" className={fieldCls} style={style} />
                </>
              )}

              {lesson.type === 'quiz' && (
                <QuizEditor questions={lesson.questions ?? []} onChange={(questions) => set({ questions })} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}
