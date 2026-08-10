'use client';

import { useState, useEffect } from 'react';
import { CaretDown, Check, X } from 'phosphor-react';

type Answer = { question_id: string; question: string; answer: string };
type Application = {
  id: string; roadmap_id: string; applicant_name: string | null; applicant_email: string | null;
  answers: Answer[]; status: 'pending' | 'approved' | 'rejected'; review_note: string | null;
  reviewed_at: string | null; cooldown_until: string | null; created_at: string;
};

const STATUS_STYLE = {
  pending:  'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  approved: 'text-green-400 bg-green-400/10 border-green-400/20',
  rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export function ApplicationsTab({ roadmapId }: { roadmapId: string }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading,       setLoading]     = useState(true);
  const [open,          setOpen]        = useState<string | null>(null);
  const [notes,         setNotes]       = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/roadmaps/${roadmapId}/applications`)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setApplications(d); })
      .finally(() => setLoading(false));
  }, [roadmapId]);

  async function review(id: string, status: 'approved' | 'rejected') {
    const res = await fetch(`/api/roadmap-applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, review_note: notes[id] ?? '' }),
    });
    const updated = await res.json();
    setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  if (!loading && applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 rounded-2xl border"
        style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
        <p className="font-semibold text-sm mb-1" style={{ color: 'var(--adm-text)' }}>No applications yet</p>
        <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>Applications will show up here once people apply for this roadmap.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {applications.map((a) => (
        <div key={a.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <button onClick={() => setOpen(open === a.id ? null : a.id)} className="w-full flex items-center gap-4 p-5 text-left">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--adm-text)' }}>{a.applicant_name || a.applicant_email || 'Applicant'}</p>
              <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>{new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${STATUS_STYLE[a.status]}`}>{a.status}</span>
            <CaretDown size={14} className={`transition-transform ${open === a.id ? 'rotate-180' : ''}`} style={{ color: 'var(--adm-muted)' }} />
          </button>

          {open === a.id && (
            <div className="px-5 pb-5 flex flex-col gap-4 border-t pt-4" style={{ borderColor: 'var(--adm-border)' }}>
              {a.answers?.map((ans, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--adm-muted)' }}>{ans.question}</p>
                  <p className="text-sm" style={{ color: 'var(--adm-text)' }}>{ans.answer}</p>
                </div>
              ))}

              {a.status === 'pending' ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={notes[a.id] ?? ''}
                    onChange={(e) => setNotes((n) => ({ ...n, [a.id]: e.target.value }))}
                    placeholder="Review note (optional)…" rows={2}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent text-xs outline-none focus:border-[#DC5B17] transition-colors resize-none"
                    style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => review(a.id, 'approved')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors">
                      <Check size={14} /> Approve
                    </button>
                    <button onClick={() => review(a.id, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors">
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs" style={{ color: 'var(--adm-muted)' }}>
                  {a.review_note && <p className="mb-1">Note: {a.review_note}</p>}
                  {a.status === 'rejected' && a.cooldown_until && (
                    <p>Can reapply after {new Date(a.cooldown_until).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
