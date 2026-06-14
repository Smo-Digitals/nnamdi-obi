'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, Star } from 'phosphor-react';
import { RichTextEditor } from '@/components/dashboard/RichTextEditor';

type RubricItem = { id: string; criterion: string; max_score: number };
type Review = { id: string; scores: Record<string, number>; overall_comment: string | null; status: string };

type Assignment = {
  id: string; title: string; description: string | null;
  due_date: string | null; rubric: RubricItem[]; reviews_required: number;
  courses: { id: string; title: string } | null;
};

type Submission = {
  id: string; content: string; status: string;
  final_score: number | null; reviews_received: number;
  peer_reviews: Review[];
} | null;

interface Props { assignment: Assignment; submission: Submission; courseId: string }

function stripHtml(html: string) { return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim(); }

export function PortalAssignmentClient({ assignment, submission: initial, courseId }: Props) {
  const [submission, setSubmission] = useState(initial);
  const [content,    setContent]    = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const maxScore = assignment.rubric.reduce((s, r) => s + r.max_score, 0);

  async function submit() {
    if (!content || content === '<p></p>') { setError('Please write your submission.'); return; }
    setSubmitting(true); setError(null);
    const res = await fetch(`/api/assignments/${assignment.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return; }
    setSubmission({ ...data.submission, peer_reviews: [] });
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link href={`/home/courses/${courseId}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold mb-6 transition-colors" style={{ color: 'var(--adm-muted)' }}>
        <ArrowLeft size={13} weight="bold" />
        {assignment.courses?.title ?? 'Back to course'}
      </Link>

      <h1 className="font-bold text-2xl mb-2" style={{ color: 'var(--adm-text)' }}>{assignment.title}</h1>
      {assignment.description && <p className="text-sm mb-1" style={{ color: 'var(--adm-muted)' }}>{assignment.description}</p>}

      <div className="flex gap-4 mb-8 text-xs" style={{ color: 'var(--adm-muted)' }}>
        {assignment.due_date && <span className="flex items-center gap-1"><Clock size={12} />Due {new Date(assignment.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
        <span className="flex items-center gap-1"><Star size={12} />Max {maxScore} pts · {assignment.reviews_required} peer reviews</span>
      </div>

      {/* Rubric */}
      <div className="rounded-2xl border p-5 mb-8" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
        <p className="text-xs font-semibold mb-3" style={{ color: 'var(--adm-muted)' }}>GRADING RUBRIC</p>
        <div className="flex flex-col gap-2">
          {assignment.rubric.map((r) => (
            <div key={r.id} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--adm-text)' }}>{r.criterion}</span>
              <span className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{r.max_score} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Already submitted */}
      {submission ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 p-4 rounded-2xl border" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <CheckCircle size={20} weight="fill" className="text-green-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>Submitted</p>
              <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>
                {submission.status === 'reviewed'
                  ? `Final score: ${submission.final_score} / ${maxScore}`
                  : `${submission.reviews_received} of ${assignment.reviews_required} reviews received`}
              </p>
            </div>
            {submission.status === 'reviewed' && submission.final_score !== null && (
              <div className="ml-auto text-right">
                <p className="text-2xl font-bold text-[#DC5B17]">{submission.final_score}</p>
                <p className="text-[10px]" style={{ color: 'var(--adm-muted)' }}>/ {maxScore}</p>
              </div>
            )}
          </div>

          {/* Peer feedback received */}
          {submission.peer_reviews.filter((r) => r.status === 'completed').map((r, i) => (
            <div key={r.id} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--adm-muted)' }}>PEER REVIEW {i + 1}</p>
              <div className="flex flex-col gap-2 mb-4">
                {assignment.rubric.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--adm-text)' }}>{item.criterion}</span>
                    <span className="text-sm font-bold text-[#DC5B17]">{r.scores[item.id] ?? 0} / {item.max_score}</span>
                  </div>
                ))}
              </div>
              {r.overall_comment && <p className="text-xs italic" style={{ color: 'var(--adm-muted)' }}>&ldquo;{r.overall_comment}&rdquo;</p>}
            </div>
          ))}

          <div className="rounded-xl border p-4" style={{ borderColor: 'var(--adm-border)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--adm-muted)' }}>YOUR SUBMISSION</p>
            <p className="text-xs leading-relaxed line-clamp-4" style={{ color: 'var(--adm-muted)' }}>{stripHtml(submission.content)}</p>
          </div>
        </div>
      ) : (
        /* Submit form */
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--adm-muted)' }}>Your Answer</label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button onClick={submit} disabled={submitting}
            className="py-3 rounded-xl bg-[#DC5B17] text-white font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-50">
            {submitting ? 'Submitting…' : 'Submit Assignment'}
          </button>
        </div>
      )}
    </div>
  );
}
