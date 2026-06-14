'use client';

import Link from 'next/link';
import { CheckCircle, Clock } from 'phosphor-react';

type ReviewItem = {
  id: string;
  status: string;
  assignment_submissions: {
    assignment_id: string;
    assignments: { title: string; courses: { title: string } | null } | null;
  } | null;
};

interface Props { reviews: ReviewItem[] }

export function PortalMyReviewsClient({ reviews }: Props) {
  const pending   = reviews.filter((r) => r.status === 'pending');
  const completed = reviews.filter((r) => r.status === 'completed');

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-bold text-2xl mb-1" style={{ color: 'var(--adm-text)' }}>My Reviews</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--adm-muted)' }}>Peer reviews assigned to you</p>

      {reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <CheckCircle size={28} className="text-[#333] mb-3" />
          <p className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>No reviews assigned yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--adm-muted)' }}>Submit an assignment to get assigned reviews.</p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--adm-muted)' }}>Pending ({pending.length})</p>
          <div className="flex flex-col gap-3">
            {pending.map((r) => (
              <Link key={r.id} href={`/home/reviews/${r.id}`}
                className="flex items-center justify-between p-4 rounded-2xl border hover:border-white/15 transition-colors"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{r.assignment_submissions?.assignments?.title ?? 'Assignment'}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--adm-muted)' }}>{r.assignment_submissions?.assignments?.courses?.title}</p>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-lg border border-yellow-400/20">
                  <Clock size={11} /> Pending
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--adm-muted)' }}>Completed ({completed.length})</p>
          <div className="flex flex-col gap-3">
            {completed.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-2xl border"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)', opacity: 0.6 }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{r.assignment_submissions?.assignments?.title ?? 'Assignment'}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--adm-muted)' }}>{r.assignment_submissions?.assignments?.courses?.title}</p>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-green-400">
                  <CheckCircle size={13} weight="fill" /> Done
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
