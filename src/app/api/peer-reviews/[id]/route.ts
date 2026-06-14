import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

type Params = Promise<{ id: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('peer_reviews')
    .select('*, assignment_submissions(content, student_id, assignment_id, assignments(title, rubric, reviews_required))')
    .eq('id', id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { scores, overall_comment } = await req.json();
  const admin = createAdminClient();

  // Mark review complete
  const { data: review, error } = await admin
    .from('peer_reviews')
    .update({ scores, overall_comment, status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', id)
    .eq('reviewer_id', user.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Increment reviews_received on the submission
  const { data: submission } = await admin
    .from('assignment_submissions')
    .select('id, reviews_received, assignment_id, assignments(reviews_required)')
    .eq('id', review.submission_id)
    .single();

  if (submission) {
    const newCount = (submission.reviews_received ?? 0) + 1;
    const required = (submission.assignments as unknown as { reviews_required: number } | null)?.reviews_required ?? 2;

    await admin.from('assignment_submissions')
      .update({ reviews_received: newCount })
      .eq('id', submission.id);

    // If enough reviews, calculate final score and mark as reviewed
    if (newCount >= required) {
      const { data: allReviews } = await admin
        .from('peer_reviews')
        .select('scores')
        .eq('submission_id', submission.id)
        .eq('status', 'completed');

      const totals = (allReviews ?? []).map((r) =>
        Object.values(r.scores as Record<string, number>).reduce((a, b) => a + b, 0)
      );
      const finalScore = totals.length ? totals.reduce((a, b) => a + b, 0) / totals.length : 0;

      await admin.from('assignment_submissions')
        .update({ status: 'reviewed', final_score: Math.round(finalScore * 10) / 10 })
        .eq('id', submission.id);
    }
  }

  return NextResponse.json({ ok: true });
}
