import { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
