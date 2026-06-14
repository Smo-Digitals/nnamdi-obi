'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'phosphor-react';
import Link from 'next/link';

type RubricItem = { id: string; criterion: string; max_score: number };

type Review = {
  id: string;
  status: string;
  assignment_submissions: {
    content: string;
    assignment_id: string;
    assignments: { title: string; rubric: RubricItem[]; reviews_required: number } | null;
  } | null;
};

interface Props { review: Review }

function stripHtml(html: string) { return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim(); }

export function PortalPeerReviewClient({ review }: Props) {
  const router   = useRouter();
  const rubric   = review.assignment_submissions?.assignments?.rubric ?? [];
  const [scores, setScores]   = useState<Record<string, number>>(Object.fromEntries(rubric.map((r) => [r.id, 0])));
  const [comment, setComment] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [done,    setDone]    = useState(review.status === 'completed');

  const total    = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxTotal = rubric.reduce((s, r) => s + r.max_score, 0);

  async function submit() {
    if (rubric.some((r) => scores[r.id] === undefined)) return;
    setSaving(true);
    const res = await fetch(`/api/peer-reviews/${review.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scores, overall_comment: comment }),
    });
    setSaving(false);
    if (res.ok) { setDone(true); setTimeout(() => router.push('/home/reviews'), 1500); }
  }

  if (done) {
    return (
      <div className="p-8 flex flex-col items-center justify-center py-32">
        <CheckCircle size={48} weight="fill" className="text-green-400 mb-4" />
        <h2 className="font-bold text-xl mb-2" style={{ color: 'var(--adm-text)' }}>Review Submitted!</h2>
        <p className="text-sm" style={{ color: 'var(--adm-muted)' }}>Redirecting you back…</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/home/reviews" className="inline-flex items-center gap-1.5 text-xs font-semibold mb-6" style={{ color: 'var(--adm-muted)' }}>
        <ArrowLeft size={13} weight="bold" /> My Reviews
      </Link>

      <h1 className="font-bold text-2xl mb-1" style={{ color: 'var(--adm-text)' }}>Peer Review</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--adm-muted)' }}>{review.assignment_submissions?.assignments?.title}</p>

      {/* Submission to review */}
      <div className="rounded-2xl border p-5 mb-8" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
        <p className="text-xs font-semibold mb-3" style={{ color: 'var(--adm-muted)' }}>SUBMISSION TO REVIEW</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--adm-text)' }}>
          {stripHtml(review.assignment_submissions?.content ?? '')}
        </p>
      </div>

      {/* Rubric scoring */}
      <div className="flex flex-col gap-5 mb-6">
        {rubric.map((item) => (
          <div key={item.id}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{item.criterion}</label>
              <span className="text-sm font-bold text-[#DC5B17]">{scores[item.id]} / {item.max_score}</span>
            </div>
            <input
              type="range" min={0} max={item.max_score} step={1}
              value={scores[item.id]}
              onChange={(e) => setScores((s) => ({ ...s, [item.id]: Number(e.target.value) }))}
              className="w-full accent-[#DC5B17]"
            />
            <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--adm-muted)' }}>
              <span>0</span><span>{item.max_score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Overall comment */}
      <div className="mb-6">
        <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Overall Feedback</label>
        <textarea
          value={comment} onChange={(e) => setComment(e.target.value)} rows={4}
          placeholder="Write constructive feedback for this student…"
          className="w-full px-4 py-3 rounded-xl border bg-transparent text-sm outline-none focus:border-[#DC5B17] transition-colors resize-none"
          style={{ color: 'var(--adm-text)', borderColor: 'var(--adm-border)' }}
        />
      </div>

      {/* Score summary + submit */}
      <div className="flex items-center justify-between p-4 rounded-2xl border mb-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
        <span className="text-sm" style={{ color: 'var(--adm-muted)' }}>Total Score</span>
        <span className="text-2xl font-bold text-[#DC5B17]">{total} <span className="text-sm font-normal" style={{ color: 'var(--adm-muted)' }}>/ {maxTotal}</span></span>
      </div>

      <button onClick={submit} disabled={saving}
        className="w-full py-3 rounded-xl bg-[#DC5B17] text-white font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-50">
        {saving ? 'Submitting…' : 'Submit Review'}
      </button>
    </div>
  );
}
