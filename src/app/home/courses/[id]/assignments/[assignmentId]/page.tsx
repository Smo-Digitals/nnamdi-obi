import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PortalAssignmentClient } from '@/components/portal/courses/PortalAssignmentClient';

type Props = { params: Promise<{ id: string; assignmentId: string }> };

export default async function AssignmentPage({ params }: Props) {
  const { id: courseId, assignmentId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: assignment } = await supabase
    .from('assignments')
    .select('id, title, description, due_date, rubric, reviews_required, courses(id, title)')
    .eq('id', assignmentId)
    .eq('status', 'published')
    .single();

  if (!assignment) notFound();

  let submission = null;
  if (user) {
    const { data } = await supabase
      .from('assignment_submissions')
      .select('id, content, status, final_score, reviews_received, peer_reviews(id, scores, overall_comment, status)')
      .eq('assignment_id', assignmentId)
      .eq('student_id', user.id)
      .single();
    submission = data ?? null;
  }

  return <PortalAssignmentClient assignment={assignment as never} submission={submission} courseId={courseId} />;
}
