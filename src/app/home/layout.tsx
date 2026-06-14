import { ReactNode } from 'react';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalHeader } from '@/components/portal/PortalHeader';

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-ui flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--adm-bg)' }}>
      <PortalSidebar />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <PortalHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
