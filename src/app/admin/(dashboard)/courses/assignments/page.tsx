import { createAdminClient } from '@/lib/supabase/admin';
import { AssignmentsClient } from '@/components/dashboard/courses/AssignmentsClient';

export default async function AssignmentsPage() {
  const admin = createAdminClient();

  const [{ data: assignments }, { data: courses }] = await Promise.all([
    admin.from('assignments').select('id, course_id, title, description, due_date, rubric, reviews_required, status, created_at').order('created_at', { ascending: false }),
    admin.from('courses').select('id, title').eq('status', 'published').order('title'),
  ]);

  return <AssignmentsClient assignments={assignments ?? []} courses={courses ?? []} />;
}
