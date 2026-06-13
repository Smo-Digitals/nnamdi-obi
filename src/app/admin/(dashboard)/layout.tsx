import { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { AdminHeader } from '@/components/dashboard/AdminHeader';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-ui flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--adm-bg)' }}>
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
