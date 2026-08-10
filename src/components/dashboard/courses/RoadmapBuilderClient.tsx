'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'phosphor-react';
import { RoadmapPanel, type Roadmap } from './RoadmapPanel';
import { StepsTab } from './StepsTab';
import { QuestionsTab } from './QuestionsTab';
import { ApplicationsTab } from './ApplicationsTab';

const TABS = ['Steps', 'Questions', 'Applications'] as const;
type Tab = typeof TABS[number];

export function RoadmapBuilderClient({ roadmapId }: { roadmapId: string }) {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [tab,     setTab]     = useState<Tab>('Steps');
  const [panel,   setPanel]   = useState(false);

  function load() {
    fetch(`/api/roadmaps/${roadmapId}`).then((r) => r.json()).then(setRoadmap);
  }
  useEffect(load, [roadmapId]);

  if (!roadmap) return <div className="p-8" style={{ color: 'var(--adm-muted)' }}>Loading…</div>;

  return (
    <div className="p-8">
      <RoadmapPanel
        open={panel}
        onClose={() => setPanel(false)}
        editing={roadmap}
        onSaved={(r) => { setRoadmap(r); setPanel(false); }}
        onDeleted={() => router.push('/admin/courses/roadmaps')}
      />

      <button onClick={() => router.push('/admin/courses/roadmaps')}
        className="flex items-center gap-1.5 text-xs font-semibold mb-4 hover:text-white transition-colors" style={{ color: 'var(--adm-muted)' }}>
        <ArrowLeft size={14} /> All Roadmaps
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>{roadmap.title}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--adm-muted)' }}>
            {roadmap.status === 'published' ? 'Published' : roadmap.status === 'draft' ? 'Draft' : 'Archived'}
            {' · '}₦{(roadmap.price ?? 0).toLocaleString()}
            {' · '}{roadmap.cooldown_days ?? 30}d reapply cooldown
          </p>
        </div>
        <button onClick={() => setPanel(true)}
          className="px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors hover:border-[#DC5B17]/40"
          style={{ borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }}>
          Edit Details
        </button>
      </div>

      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ backgroundColor: 'var(--adm-card)' }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === t ? 'bg-[#DC5B17] text-white' : 'text-[#555] hover:text-white'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Steps' && <StepsTab roadmapId={roadmapId} />}
      {tab === 'Questions' && <QuestionsTab roadmapId={roadmapId} />}
      {tab === 'Applications' && <ApplicationsTab roadmapId={roadmapId} />}
    </div>
  );
}
