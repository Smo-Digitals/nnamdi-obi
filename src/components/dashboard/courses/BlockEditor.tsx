'use client';

import { useState } from 'react';
import { Reorder, useDragControls, AnimatePresence, motion } from 'framer-motion';
import { Trash, CaretDown, DotsSixVertical } from 'phosphor-react';
import { FileUploadField } from './FileUploadField';
import { BLOCK_META, blockSummary } from './blockMeta';
import type { Block } from './roadmapTypes';

interface Props {
  block: Block;
  onChange: (b: Block) => void;
  onRemove: () => void;
}

const fieldCls = 'w-full px-3 py-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-[#DC5B17] transition-colors';

export function BlockEditor({ block, onChange, onRemove }: Props) {
  const [open, setOpen] = useState(true);
  const controls = useDragControls();
  const set = (patch: Partial<Block>) => onChange({ ...block, ...patch });
  const style = { color: 'var(--adm-text)', borderColor: 'var(--adm-border)' };
  const meta = BLOCK_META[block.type];
  const Icon = meta.icon;

  return (
    <Reorder.Item
      as="div"
      value={block}
      dragListener={false}
      dragControls={controls}
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-card)' }}
      whileDrag={{ boxShadow: '0 12px 28px rgba(0,0,0,0.35)', scale: 1.01, zIndex: 10 }}
    >
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none" onClick={() => setOpen((o) => !o)}>
        <span
          onPointerDown={(e) => { e.stopPropagation(); controls.start(e); }}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab active:cursor-grabbing text-[#555] hover:text-white transition-colors shrink-0"
        >
          <DotsSixVertical size={16} weight="bold" />
        </span>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>
          <Icon size={14} weight="bold" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: meta.color }}>{meta.label}</p>
          <p className="text-xs truncate" style={{ color: 'var(--adm-muted)' }}>{blockSummary(block)}</p>
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
              <input value={block.title ?? ''} onChange={(e) => set({ title: e.target.value })} placeholder="Block title (optional)"
                className={fieldCls} style={style} />

              {block.type === 'text' && (
                <textarea value={block.content ?? ''} onChange={(e) => set({ content: e.target.value })} rows={4}
                  placeholder="Write the content…" className={`${fieldCls} resize-none`} style={style} />
              )}

              {block.type === 'video' && (
                <input value={block.url ?? ''} onChange={(e) => set({ url: e.target.value })}
                  placeholder="Video URL (YouTube, Vimeo, hosted link)…" className={fieldCls} style={style} />
              )}
              {block.type === 'link' && (
                <>
                  <input value={block.url ?? ''} onChange={(e) => set({ url: e.target.value })}
                    placeholder="https://…" className={fieldCls} style={style} />
                  <input value={block.label ?? ''} onChange={(e) => set({ label: e.target.value })} placeholder="Link label"
                    className={fieldCls} style={style} />
                </>
              )}

              {block.type === 'image' && (
                <FileUploadField url={block.url} onChange={(url) => set({ url })} accept="image/*" placeholder="Image URL, or upload…" />
              )}

              {block.type === 'document' && (
                <>
                  <FileUploadField url={block.url} onChange={(url) => set({ url })} accept=".pdf,.doc,.docx" placeholder="Document URL, or upload…" />
                  <label className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--adm-muted)' }}>
                    <input type="checkbox" checked={block.downloadable ?? false} onChange={(e) => set({ downloadable: e.target.checked })} />
                    Allow download (default: view in-app only, no download or print)
                  </label>
                </>
              )}

              {block.type === 'ebook' && (
                <>
                  <FileUploadField url={block.url} onChange={(url) => set({ url })} accept=".pdf,.epub" placeholder="Ebook file URL, or upload…" />
                  <input value={block.author ?? ''} onChange={(e) => set({ author: e.target.value })} placeholder="Author (optional)"
                    className={fieldCls} style={style} />
                </>
              )}

              {(block.type === 'video' || block.type === 'image') && (
                <input value={block.caption ?? ''} onChange={(e) => set({ caption: e.target.value })} placeholder="Caption (optional)"
                  className={fieldCls} style={style} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}
