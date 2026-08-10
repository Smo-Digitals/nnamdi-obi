'use client';

import { useState } from 'react';
import { Plus, Trash, Paperclip } from 'phosphor-react';
import { uid, type Resource } from './courseTypes';

interface Props { resources: Resource[]; onChange: (resources: Resource[]) => void }

export function ResourcesList({ resources, onChange }: Props) {
  const [title, setTitle] = useState('');
  const [url,   setUrl]   = useState('');

  const style = { color: 'var(--adm-text)', borderColor: 'var(--adm-border)' };
  const fieldCls = 'flex-1 px-3 py-2 rounded-lg border bg-transparent text-xs outline-none focus:border-[#DC5B17] transition-colors';

  function add() {
    if (!title.trim() || !url.trim()) return;
    onChange([...resources, { id: uid(), title: title.trim(), url: url.trim() }]);
    setTitle(''); setUrl('');
  }
  function remove(id: string) { onChange(resources.filter((r) => r.id !== id)); }

  return (
    <div className="flex flex-col gap-2 pt-1">
      <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--adm-muted)' }}>Resources</p>
      {resources.map((r) => (
        <div key={r.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg border" style={{ borderColor: 'var(--adm-border)' }}>
          <Paperclip size={13} style={{ color: 'var(--adm-muted)' }} className="shrink-0" />
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 text-xs truncate" style={{ color: 'var(--adm-text)' }}>{r.title}</a>
          <button onClick={() => remove(r.id)} className="p-1 rounded-md text-[#555] hover:text-red-400 transition-colors shrink-0"><Trash size={13} /></button>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource title…" className={fieldCls} style={style} />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className={fieldCls} style={style} />
        <button onClick={add} className="p-1.5 rounded-md text-[#DC5B17] hover:bg-[#DC5B17]/10 transition-colors shrink-0"><Plus size={14} weight="bold" /></button>
      </div>
    </div>
  );
}
