'use client';

import Link from 'next/link';
import { Users, BookOpen, CurrencyDollar, ChartLine, Plus } from 'phosphor-react';
import { EmptyChart } from '@/components/dashboard/EmptyChart';

type Member = { id: string; full_name: string | null; created_at: string };
type Course = {
  id: string; title: string; description: string | null;
  cover_image_url: string | null; price: number | null;
  status: string; created_at: string;
};

interface Props {
  memberCount:   number;
  recentMembers: Member[];
  courseCount:   number;
  courses:       Course[];
}

const STATUS_STYLE: Record<string, string> = {
  published: 'bg-green-500/10 text-green-500',
  draft:     'bg-yellow-500/10 text-yellow-500',
  archived:  'bg-white/5 text-[#555]',
};

export function DashboardContent({ memberCount, recentMembers, courseCount, courses }: Props) {
  const stats = [
    { label: 'Total Members',  value: memberCount, icon: Users,          prefix: '',  suffix: '' },
    { label: 'Active Courses', value: courseCount, icon: BookOpen,       prefix: '',  suffix: '' },
    { label: 'Revenue',        value: 0,           icon: CurrencyDollar, prefix: '₦', suffix: '' },
    { label: 'Growth',         value: 0,           icon: ChartLine,      prefix: '',  suffix: '%' },
  ];

  return (
    <div className="p-8 min-h-screen">

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, prefix, suffix }) => (
          <div key={label} className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium" style={{ color: 'var(--adm-muted)' }}>{label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--adm-pill)' }}>
                <Icon size={15} className="text-[#DC5B17]" />
              </div>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: 'var(--adm-text)' }}>
              {prefix}{value.toLocaleString()}{suffix}
            </p>
            <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>No change yet</p>
          </div>
        ))}
      </div>

      {/* Chart + Recent members */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-8">

        <div className="xl:col-span-3 rounded-2xl p-6 border" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <div className="mb-6">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>Member growth</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--adm-muted)' }}>Members joined over time</p>
          </div>
          <EmptyChart />
        </div>

        <div className="xl:col-span-2 rounded-2xl p-6 border flex flex-col" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <h2 className="font-semibold text-sm mb-6" style={{ color: 'var(--adm-text)' }}>Recent members</h2>

          {recentMembers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-2xl border flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--adm-pill)', borderColor: 'var(--adm-border)' }}>
                <Users size={20} style={{ color: 'var(--adm-muted)' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--adm-muted)' }}>No members yet</p>
              <p className="text-xs mt-1" style={{ color: 'var(--adm-muted)' }}>Members will appear here once they join</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {recentMembers.map((m) => {
                const name  = m.full_name || 'Unknown';
                const initl = name[0]?.toUpperCase() ?? '?';
                return (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--adm-pill)' }}>
                      <span className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{initl}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--adm-text)' }}>{name}</p>
                      <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>
                        Joined {new Date(m.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>Courses</h2>
          <Link href="/admin/courses"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#DC5B17] text-white hover:bg-[#c44f13] transition-colors">
            <Plus size={12} weight="bold" /> New course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-2xl p-12 border flex flex-col items-center justify-center text-center" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <div className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--adm-pill)', borderColor: 'var(--adm-border)' }}>
              <BookOpen size={24} style={{ color: 'var(--adm-muted)' }} />
            </div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--adm-text)' }}>No courses yet</p>
            <p className="text-xs mb-5 max-w-xs" style={{ color: 'var(--adm-muted)' }}>
              Create your first course and start sharing knowledge with your community.
            </p>
            <Link href="/admin/courses"
              className="px-5 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">
              Create first course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {courses.map((c) => (
              <Link key={c.id} href={`/admin/courses`}
                className="rounded-2xl border overflow-hidden hover:shadow-sm transition-all group" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
                {/* Thumbnail */}
                <div className="w-full h-32 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: 'var(--adm-pill)' }}>
                  {c.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.cover_image_url} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <BookOpen size={28} className="text-[#DC5B17]" weight="duotone" />
                  )}
                </div>
                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm line-clamp-1 flex-1" style={{ color: 'var(--adm-text)' }}>{c.title}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLE[c.status] ?? STATUS_STYLE.draft}`}>
                      {c.status}
                    </span>
                  </div>
                  {c.description && (
                    <p className="text-xs line-clamp-2 mb-2" style={{ color: 'var(--adm-muted)' }}>{c.description}</p>
                  )}
                  <p className="text-xs font-semibold text-[#DC5B17]">
                    {c.price ? `₦${c.price.toLocaleString()}` : 'Free'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
