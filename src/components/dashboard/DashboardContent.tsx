'use client';

import { Users, BookOpen, CurrencyDollar, ChartLine } from 'phosphor-react';
import { EmptyChart } from '@/components/dashboard/EmptyChart';

type Member = { id: string; full_name: string | null; created_at: string };

interface Props {
  memberCount: number;
  recentMembers: Member[];
}

const stats = (memberCount: number) => [
  { label: 'Total Members',  value: memberCount, icon: Users,          prefix: '',  suffix: '' },
  { label: 'Active Courses', value: 0,           icon: BookOpen,       prefix: '',  suffix: '' },
  { label: 'Revenue',        value: 0,           icon: CurrencyDollar, prefix: '₦', suffix: '' },
  { label: 'Growth',         value: 0,           icon: ChartLine,      prefix: '',  suffix: '%' },
];

export function DashboardContent({ memberCount, recentMembers }: Props) {
  return (
    <div className="p-8 min-h-screen">

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats(memberCount).map(({ label, value, icon: Icon, prefix, suffix }) => (
          <div key={label} className="bg-[var(--adm-card)] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#555] text-xs font-medium">{label}</p>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <Icon size={15} className="text-[#DC5B17]" />
              </div>
            </div>
            <p className="text-white text-2xl font-bold mb-1">
              {prefix}{value.toLocaleString()}{suffix}
            </p>
            <p className="text-[#444] text-xs">No change yet</p>
          </div>
        ))}
      </div>

      {/* Chart + Recent members */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-8">

        <div className="xl:col-span-3 bg-[var(--adm-card)] border border-white/5 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-white font-semibold text-sm">Member growth</h2>
            <p className="text-[#444] text-xs mt-0.5">Members joined over time</p>
          </div>
          <EmptyChart />
        </div>

        <div className="xl:col-span-2 bg-[var(--adm-card)] border border-white/5 rounded-2xl p-6 flex flex-col">
          <h2 className="text-white font-semibold text-sm mb-6">Recent members</h2>

          {recentMembers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                <Users size={20} className="text-[#333]" />
              </div>
              <p className="text-[#444] text-sm font-medium">No members yet</p>
              <p className="text-[#333] text-xs mt-1">Members will appear here once they join</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {recentMembers.map((m) => {
                const name  = m.full_name || 'Unknown';
                const initl = name[0]?.toUpperCase() ?? '?';
                return (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <span className="text-[#aaa] text-xs font-semibold">{initl}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{name}</p>
                      <p className="text-[#555] text-xs">Joined {new Date(m.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Courses empty state */}
      <div>
        <h2 className="text-white font-semibold text-sm mb-4">Courses</h2>
        <div className="bg-[var(--adm-card)] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
            <BookOpen size={24} className="text-[#333]" />
          </div>
          <p className="text-white font-semibold text-sm mb-1">No courses yet</p>
          <p className="text-[#444] text-xs mb-5 max-w-xs">
            Create your first course and start sharing knowledge with your community.
          </p>
          <button className="px-5 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">
            Create first course
          </button>
        </div>
      </div>

    </div>
  );
}
