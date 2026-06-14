import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

type Params = Promise<{ id: string }>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id: assignmentId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content, file_url } = await req.json();
  const admin = createAdminClient();

  // Insert submission
  const { data: submission, error: subErr } = await admin
    .from('assignment_submissions')
    .insert({ assignment_id: assignmentId, student_id: user.id, content, file_url })
    .select()
    .single();
  if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });

  // Get assignment to know how many reviews are required
  const { data: assignment } = await admin
    .from('assignments')
    .select('reviews_required')
    .eq('id', assignmentId)
    .single();
  const reviewsRequired = assignment?.reviews_required ?? 2;

  // Find other submissions that still need reviewers (not by this student, not already assigned)
  const { data: otherSubmissions } = await admin
    .from('assignment_submissions')
    .select('id, student_id, reviews_received, reviews_required:assignments(reviews_required)')
    .eq('assignment_id', assignmentId)
    .neq('student_id', user.id)
    .neq('id', submission.id);

  // Assign this new submitter as a reviewer for submissions that still need reviews
  const toReview = (otherSubmissions ?? [])
    .filter((s) => (s.reviews_received ?? 0) < reviewsRequired)
    .slice(0, reviewsRequired);

  for (const s of toReview) {
    await admin.from('peer_reviews').insert({
      submission_id: s.id,
      reviewer_id: user.id,
    }).select();
  }

  // Find students who can review this new submission (have submitted but not already assigned)
  const { data: potentialReviewers } = await admin
    .from('assignment_submissions')
    .select('student_id')
    .eq('assignment_id', assignmentId)
    .neq('student_id', user.id)
    .neq('id', submission.id);

  const reviewersToAssign = (potentialReviewers ?? []).slice(0, reviewsRequired);
  for (const r of reviewersToAssign) {
    await admin.from('peer_reviews').insert({
      submission_id: submission.id,
      reviewer_id: r.student_id,
    }).select();
  }

  // Update submission status to in_review if reviewers were assigned
  if (reviewersToAssign.length > 0) {
    await admin.from('assignment_submissions')
      .update({ status: 'in_review' })
      .eq('id', submission.id);
  }

  return NextResponse.json({ ok: true, submission });
}
