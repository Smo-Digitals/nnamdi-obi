import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default async function DashboardPage() {
  const supabase = await createClient();
  const admin    = createAdminClient();

  const [
    { count: memberCount },
    { data: recentMembers },
    { count: courseCount },
    { data: courses },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'member'),

    supabase
      .from('profiles')
      .select('id, full_name, created_at')
      .eq('role', 'member')
      .order('created_at', { ascending: false })
      .limit(5),

    admin
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),

    admin
      .from('courses')
      .select('id, title, description, cover_image_url, price, status, created_at')
      .order('created_at', { ascending: false })
      .limit(6),
  ]);

  return (
    <DashboardContent
      memberCount={memberCount ?? 0}
      recentMembers={recentMembers ?? []}
      courseCount={courseCount ?? 0}
      courses={courses ?? []}
    />
  );
}
