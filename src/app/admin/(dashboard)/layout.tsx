import { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { AdminHeader } from '@/components/dashboard/AdminHeader';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null };
  const role = profile?.role ?? 'guest';

  return (
    <div className="admin-ui flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--adm-bg)' }}>
      <Sidebar role={role} />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
