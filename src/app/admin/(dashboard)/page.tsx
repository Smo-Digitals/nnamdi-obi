import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { count: memberCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'member');

  const { data: recentMembers } = await supabase
    .from('profiles')
    .select('id, full_name, created_at')
    .eq('role', 'member')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <DashboardContent
      memberCount={memberCount ?? 0}
      recentMembers={recentMembers ?? []}
    />
  );
}
