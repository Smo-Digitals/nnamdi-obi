'use client';

import { useState } from 'react';
import { Plus, PushPin, Eye, NotePencil } from 'phosphor-react';
import { AnnouncementPanel } from './AnnouncementPanel';

export type Announcement = {
  id: string;
  title: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  pinned: boolean;
  created_at: string;
};

const STATUS_STYLE: Record<string, string> = {
  published: 'text-green-400 bg-green-400/10 border-green-400/20',
  draft:     'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  archived:  'text-[#555] bg-white/5 border-white/10',
};

const FILTERS = ['all', 'published', 'draft', 'archived'] as const;
type Filter = (typeof FILTERS)[number];

interface Props { announcements: Announcement[] }

export function AnnouncementsClient({ announcements: initial }: Props) {
  const [list,       setList]       = useState(initial);
  const [panelOpen,  setPanelOpen]  = useState(false);
  const [editing,    setEditing]    = useState<Announcement | null>(null);
  const [filter,     setFilter]     = useState<Filter>('all');

  const filtered   = filter === 'all' ? list : list.filter((a) => a.status === filter);
  const published  = list.filter((a) => a.status === 'published').length;
  const drafts     = list.filter((a) => a.status === 'draft').length;
  const pinned     = list.filter((a) => a.pinned).length;

  function openCreate() { setEditing(null); setPanelOpen(true); }
  function openEdit(a: Announcement) { setEditing(a); setPanelOpen(true); }

  function onSaved(saved: Announcement) {
    setList((prev) => {
      const idx = prev.findIndex((a) => a.id === saved.id);
      if (idx !== -1) { const next = [...prev]; next[idx] = saved; return next; }
      return [saved, ...prev];
    });
    setPanelOpen(false);
  }

  function onDeleted(id: string) {
    setList((prev) => prev.filter((a) => a.id !== id));
    setPanelOpen(false);
  }

  return (
    <>
      <AnnouncementPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        editing={editing}
        onSaved={onSaved}
        onDeleted={onDeleted}
      />

      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>Announcements</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--adm-muted)' }}>Keep your community informed</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#DC5B17] text-white text-sm font-semibold rounded-xl hover:bg-[#c44f13] transition-colors"
          >
            <Plus size={15} weight="bold" />
            New Announcement
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total',     value: list.length },
            { label: 'Published', value: published },
            { label: 'Drafts',    value: drafts },
            { label: 'Pinned',    value: pinned },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--adm-muted)' }}>{label}</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--adm-text)' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ backgroundColor: 'var(--adm-card)' }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === f ? 'bg-[#DC5B17] text-white' : 'text-[#555] hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border"
            style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <div className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-4"
              style={{ borderColor: 'var(--adm-border)' }}>
              <NotePencil size={24} className="text-[#333]" />
            </div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--adm-text)' }}>No announcements yet</p>
            <p className="text-xs mb-5" style={{ color: 'var(--adm-muted)' }}>
              Create your first announcement to keep your community informed
            </p>
            <button
              onClick={openCreate}
              className="px-5 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors"
            >
              Create Announcement
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((a) => (
              <button
                key={a.id}
                onClick={() => openEdit(a)}
                className="w-full flex items-start gap-4 p-5 rounded-2xl border text-left hover:border-white/10 transition-colors"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}
              >
                {a.pinned && <PushPin size={15} className="text-[#DC5B17] mt-0.5 shrink-0" weight="fill" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--adm-text)' }}>{a.title}</h3>
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${STATUS_STYLE[a.status]}`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--adm-muted)' }}>{a.body}</p>
                  <p className="text-[11px] mt-2" style={{ color: 'var(--adm-muted)' }}>
                    {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <Eye size={15} className="text-[#333] shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
