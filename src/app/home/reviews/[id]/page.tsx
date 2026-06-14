import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PortalPeerReviewClient } from '@/components/portal/courses/PortalPeerReviewClient';

type Props = { params: Promise<{ id: string }> };

export default async function PeerReviewPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data } = await supabase
    .from('peer_reviews')
    .select('id, status, scores, overall_comment, assignment_submissions(content, assignment_id, assignments(title, rubric, reviews_required))')
    .eq('id', id)
    .eq('reviewer_id', user.id)
    .single();

  if (!data) notFound();

  return <PortalPeerReviewClient review={data as never} />;
}
