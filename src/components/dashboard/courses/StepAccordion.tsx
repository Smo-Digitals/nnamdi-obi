'use client';

import { useState, useRef, useEffect } from 'react';
import { Reorder, useDragControls, AnimatePresence, motion } from 'framer-motion';
import { CaretDown, DotsSixVertical, Trash, Check, CircleNotch } from 'phosphor-react';
import { BlockEditor } from './BlockEditor';
import { AddContentMenu } from './AddContentMenu';
import { uid, type Block, type BlockType, type Step } from './roadmapTypes';

export type SaveStatus = 'idle' | 'saving' | 'saved';

interface Props {
  step: Step;
  status: SaveStatus;
  autoFocus?: boolean;
  onChange: (patch: Partial<Step>) => void;
  onDelete: () => void;
}

export function StepAccordion({ step, status, autoFocus, onChange, onDelete }: Props) {
  const [open, setOpen] = useState(!!autoFocus);
  const controls = useDragControls();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (autoFocus) titleRef.current?.focus(); }, [autoFocus]);

  function addBlock(type: BlockType) {
    const block: Block = { id: uid(), type };
    onChange({ blocks: [...step.blocks, block] });
    setOpen(true);
  }
  function updateBlock(id: string, b: Block) { onChange({ blocks: step.blocks.map((x) => (x.id === id ? b : x)) }); }
  function removeBlock(id: string) { onChange({ blocks: step.blocks.filter((x) => x.id !== id) }); }

  const style = { color: 'var(--adm-text)', borderColor: 'var(--adm-border)' };
  const inputCls = 'w-full bg-transparent text-sm font-semibold outline-none border-b border-transparent focus:border-[#DC5B17] transition-colors py-0.5';

  return (
    <Reorder.Item
      as="div"
      value={step}
      dragListener={false}
      dragControls={controls}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-card)' }}
      whileDrag={{ boxShadow: '0 14px 32px rgba(0,0,0,0.4)', scale: 1.005, zIndex: 20 }}
    >
      <div className="flex items-center gap-3 px-5 py-4">
        <span onPointerDown={(e) => controls.start(e)} className="cursor-grab active:cursor-grabbing text-[#555] hover:text-white transition-colors shrink-0">
          <DotsSixVertical size={18} weight="bold" />
        </span>

        <button onClick={() => setOpen((o) => !o)} className="shrink-0" style={{ color: 'var(--adm-muted)' }}>
          <CaretDown size={14} className="transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
        </button>

        <input ref={titleRef} value={step.title} onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Untitled Step" className={inputCls} style={style} />

        <div className="flex items-center gap-3 shrink-0">
          {status !== 'idle' && (
            <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--adm-muted)' }}>
              {status === 'saving' ? <CircleNotch size={11} className="animate-spin" /> : <Check size={11} className="text-green-400" />}
              {status === 'saving' ? 'Saving…' : 'Saved'}
            </span>
          )}
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md" style={{ color: 'var(--adm-muted)', backgroundColor: 'var(--adm-bg)' }}>
            {step.blocks.length} item{step.blocks.length === 1 ? '' : 's'}
          </span>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}>
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
              <textarea value={step.description ?? ''} onChange={(e) => onChange({ description: e.target.value })}
                placeholder="Add a short description for this step (optional)…" rows={2}
                className="w-full px-3 py-2 rounded-lg border bg-transparent text-xs outline-none focus:border-[#DC5B17] transition-colors resize-none"
                style={style} />

              {step.blocks.length > 0 && (
                <Reorder.Group as="div" axis="y" values={step.blocks} onReorder={(blocks) => onChange({ blocks })} className="flex flex-col gap-2.5">
                  {step.blocks.map((b) => (
                    <BlockEditor key={b.id} block={b} onChange={(nb) => updateBlock(b.id, nb)} onRemove={() => removeBlock(b.id)} />
                  ))}
                </Reorder.Group>
              )}

              <div>
                <AddContentMenu onSelect={addBlock} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}
