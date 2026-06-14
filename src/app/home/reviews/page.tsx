import { createClient } from '@/lib/supabase/server';
import { PortalMyReviewsClient } from '@/components/portal/courses/PortalMyReviewsClient';

export default async function MyReviewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-8"><p style={{ color: 'var(--adm-muted)' }}>Please log in.</p></div>;
  }

  const { data: reviews } = await supabase
    .from('peer_reviews')
    .select('id, status, assigned_at, assignment_submissions(assignment_id, assignments(title, course_id, courses(title)))')
    .eq('reviewer_id', user.id)
    .order('assigned_at', { ascending: false });

  return <PortalMyReviewsClient reviews={(reviews ?? []) as never} />;
}
