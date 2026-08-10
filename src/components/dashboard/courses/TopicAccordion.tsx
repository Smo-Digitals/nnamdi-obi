'use client';

import { useState, useRef, useEffect } from 'react';
import { Reorder, useDragControls, AnimatePresence, motion } from 'framer-motion';
import { CaretDown, DotsSixVertical, Trash, Check, CircleNotch, Copy } from 'phosphor-react';
import { LessonEditor } from './LessonEditor';
import { AddLessonButtons } from './AddLessonButtons';
import { ResourcesList } from './ResourcesList';
import { uid, type Lesson, type LessonType, type Topic } from './courseTypes';

export type SaveStatus = 'idle' | 'saving' | 'saved';

interface Props {
  topic: Topic;
  status: SaveStatus;
  autoFocus?: boolean;
  onChange: (patch: Partial<Topic>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function TopicAccordion({ topic, status, autoFocus, onChange, onDelete, onDuplicate }: Props) {
  const [open, setOpen] = useState(!!autoFocus);
  const controls = useDragControls();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (autoFocus) titleRef.current?.focus(); }, [autoFocus]);

  function addLesson(type: LessonType) {
    const lesson: Lesson = { id: uid(), type, title: '' };
    onChange({ lessons: [...topic.lessons, lesson] });
    setOpen(true);
  }
  function updateLesson(id: string, l: Lesson) { onChange({ lessons: topic.lessons.map((x) => (x.id === id ? l : x)) }); }
  function removeLesson(id: string) { onChange({ lessons: topic.lessons.filter((x) => x.id !== id) }); }

  const style = { color: 'var(--adm-text)', borderColor: 'var(--adm-border)' };
  const inputCls = 'w-full px-3 py-2 rounded-lg border bg-transparent text-sm font-semibold outline-none focus:border-[#DC5B17] transition-colors';

  return (
    <Reorder.Item
      as="div"
      value={topic}
      dragListener={false}
      dragControls={controls}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-card)', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }}
      whileDrag={{ boxShadow: '0 14px 32px rgba(0,0,0,0.4)', scale: 1.005, zIndex: 20 }}
    >
      <div className="flex items-center gap-3 px-5 py-4">
        <span onPointerDown={(e) => controls.start(e)} className="cursor-grab active:cursor-grabbing text-[#555] hover:text-white transition-colors shrink-0">
          <DotsSixVertical size={18} weight="bold" />
        </span>

        <button onClick={() => setOpen((o) => !o)} className="shrink-0" style={{ color: 'var(--adm-muted)' }}>
          <CaretDown size={14} className="transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
        </button>

        <input ref={titleRef} value={topic.title} onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Untitled Topic" className={inputCls} style={style} />

        <div className="flex items-center gap-3 shrink-0">
          {status !== 'idle' && (
            <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--adm-muted)' }}>
              {status === 'saving' ? <CircleNotch size={11} className="animate-spin" /> : <Check size={11} className="text-green-400" />}
              {status === 'saving' ? 'Saving…' : 'Saved'}
            </span>
          )}
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md" style={{ color: 'var(--adm-muted)', backgroundColor: 'var(--adm-bg)' }}>
            {topic.lessons.length} lesson{topic.lessons.length === 1 ? '' : 's'}
          </span>
          <button onClick={onDuplicate} title="Duplicate topic" className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}>
            <Copy size={14} />
          </button>
          <button onClick={onDelete} title="Delete topic" className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}>
            <Trash size={14} />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 flex flex-col gap-3 border-t pt-4" style={{ borderColor: 'var(--adm-border)' }}>
              <textarea value={topic.description ?? ''} onChange={(e) => onChange({ description: e.target.value })}
                placeholder="Add a short description for this topic (optional)…" rows={2}
                className="w-full px-3 py-2 rounded-lg border bg-transparent text-xs outline-none focus:border-[#DC5B17] transition-colors resize-none"
                style={style} />

              {topic.lessons.length > 0 && (
                <Reorder.Group as="div" axis="y" values={topic.lessons} onReorder={(lessons) => onChange({ lessons })} className="flex flex-col gap-2.5">
                  {topic.lessons.map((l) => (
                    <LessonEditor key={l.id} lesson={l} onChange={(nl) => updateLesson(l.id, nl)} onRemove={() => removeLesson(l.id)} />
                  ))}
                </Reorder.Group>
              )}

              <AddLessonButtons onSelect={addLesson} />

              <ResourcesList resources={topic.resources ?? []} onChange={(resources) => onChange({ resources })} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}
