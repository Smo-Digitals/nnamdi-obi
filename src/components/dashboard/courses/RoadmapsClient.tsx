'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PencilSimple, Trash, Path } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';
import { RoadmapPanel, type Roadmap } from './RoadmapPanel';

const S: Record<Roadmap['status'], string> = {
  published: 'text-green-400 bg-green-400/10 border-green-400/20',
  draft:     'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  archived:  'text-[#555] bg-white/5 border-white/10',
};

export function RoadmapsClient() {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [panel,    setPanel]    = useState(false);
  const [editing,  setEditing]  = useState<Roadmap | null>(null);

  useEffect(() => {
    fetch('/api/roadmaps')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setRoadmaps(d); })
      .finally(() => setLoading(false));
  }, []);

  function openCreate() { setEditing(null); setPanel(true); }
  function openEdit(r: Roadmap, e: React.MouseEvent) { e.stopPropagation(); setEditing(r); setPanel(true); }

  function onSaved(r: Roadmap) {
    setRoadmaps((prev) => {
      const idx = prev.findIndex((x) => x.id === r.id);
      if (idx !== -1) { const next = [...prev]; next[idx] = r; return next; }
      return [r, ...prev];
    });
    setPanel(false);
  }

  function onDeleted(id: string) {
    setRoadmaps((prev) => prev.filter((r) => r.id !== id));
    setPanel(false);
  }

  const rows = filter === 'all' ? roadmaps : roadmaps.filter((r) => r.status === filter);
  const naira = (n: number | null) => `₦${(n ?? 0).toLocaleString()}`;

  return (
    <>
      <RoadmapPanel open={panel} onClose={() => setPanel(false)} editing={editing} onSaved={onSaved} onDeleted={onDeleted} />
      <SectionLayout
        title="Roadmaps"
        subtitle="Application-gated playbooks: your tools, contacts and strategy"
        cta={{ label: 'New Roadmap', onClick: openCreate }}
        stats={[
          { label: 'Total',     value: roadmaps.length },
          { label: 'Published', value: roadmaps.filter((r) => r.status === 'published').length },
          { label: 'Draft',     value: roadmaps.filter((r) => r.status === 'draft').length },
        ]}
        filters={['all', 'published', 'draft', 'archived']}
        active={filter}
        onFilter={setFilter}
      >
        {loading ? null : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border"
            style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--adm-text)' }}>No roadmaps yet</p>
            <p className="text-xs mb-5" style={{ color: 'var(--adm-muted)' }}>Create your first roadmap to get started</p>
            <button onClick={openCreate} className="px-5 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">
              New Roadmap
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {rows.map((r) => (
              <div key={r.id} onClick={() => router.push(`/admin/courses/roadmaps/${r.id}`)}
                className="rounded-2xl border p-5 flex items-center gap-4 cursor-pointer hover:border-[#DC5B17]/30 transition-colors"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
                <div className={`p-2.5 rounded-xl ${r.status === 'published' ? 'bg-[#DC5B17]/20 text-[#DC5B17]' : 'bg-white/5 text-[#444]'}`}>
                  <Path size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--adm-text)' }}>{r.title}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${S[r.status]}`}>{r.status}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>{naira(r.price)} · {r.cooldown_days ?? 30}d reapply cooldown</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={(e) => openEdit(r, e)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><PencilSimple size={14} /></button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!confirm('Delete this roadmap? This cannot be undone.')) return;
                      setRoadmaps((prev) => prev.filter((x) => x.id !== r.id));
                      await fetch(`/api/roadmaps/${r.id}`, { method: 'DELETE' });
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}
                  ><Trash size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionLayout>
    </>
  );
}
