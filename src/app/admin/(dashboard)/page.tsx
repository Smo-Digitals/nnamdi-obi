'use client';

import { GrowthChart } from '@/components/dashboard/GrowthChart';
import { Users, BookOpen, CurrencyDollar, Bell } from 'phosphor-react';

const stats = [
  { label: 'Total Members',    value: '1,240', icon: Users,           delta: '+12%' },
  { label: 'Active Courses',   value: '8',     icon: BookOpen,        delta: '+2' },
  { label: 'Revenue (Jun)',     value: '₦480k', icon: CurrencyDollar,  delta: '+18%' },
  { label: 'Pending Payments', value: '34',    icon: Bell,            delta: '-5' },
];

const recentMembers = [
  { name: 'Adaeze Okonkwo',  course: 'Business Growth',    time: '2m ago' },
  { name: 'Emeka Nwosu',     course: 'Tech Foundations',   time: '14m ago' },
  { name: 'Chioma Eze',      course: 'Business Growth',    time: '1h ago' },
  { name: 'Tunde Adeyemi',   course: 'Leadership 101',     time: '3h ago' },
  { name: 'Ngozi Okafor',    course: 'Tech Foundations',   time: '5h ago' },
];

const courses = [
  { title: 'Business Growth Masterclass', members: 240, status: 'Active',    color: '#DC5B17' },
  { title: 'Tech Foundations',            members: 180, status: 'Active',    color: '#22c55e' },
  { title: 'Leadership 101',              members: 95,  status: 'Active',    color: '#eab308' },
  { title: 'Personal Finance Basics',     members: 50,  status: 'Draft',     color: '#555' },
];

export default function DashboardPage() {
  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Welcome back, Nnamdi!</h1>
          <p className="text-[#555] text-sm mt-0.5">Here&apos;s what&apos;s happening with your community.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[#aaa] text-sm hover:text-white hover:bg-white/10 transition-colors">
          <CurrencyDollar size={15} />
          Export report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, delta }) => {
          const positive = delta.startsWith('+');
          return (
            <div key={label} className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#555] text-xs font-medium">{label}</p>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon size={15} className="text-[#DC5B17]" />
                </div>
              </div>
              <p className="text-white text-2xl font-bold mb-1">{value}</p>
              <p className={`text-xs font-medium ${positive ? 'text-green-500' : 'text-red-400'}`}>
                {delta} this month
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart + Recent members */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-8">
        {/* Chart */}
        <div className="xl:col-span-3 bg-[#0e0e0e] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold text-sm">Member growth</h2>
            <span className="text-[#555] text-xs px-3 py-1 rounded-full bg-white/5">Jan – Jul</span>
          </div>
          <GrowthChart />
        </div>

        {/* Recent members */}
        <div className="xl:col-span-2 bg-[#0e0e0e] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold text-sm">Recent members</h2>
            <button className="text-[#DC5B17] text-xs hover:underline">View all</button>
          </div>
          <div className="flex flex-col gap-4">
            {recentMembers.map(({ name, course, time }) => (
              <div key={name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <span className="text-[#aaa] text-xs font-semibold">{name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{name}</p>
                  <p className="text-[#555] text-xs truncate">{course}</p>
                </div>
                <span className="text-[#444] text-xs shrink-0">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-sm">Your Courses</h2>
          <button className="flex items-center gap-1.5 text-xs text-[#DC5B17] hover:underline">
            <BookOpen size={13} /> New course
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {courses.map(({ title, members, status, color }) => (
            <div key={title} className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors cursor-pointer group">
              {/* Thumbnail placeholder */}
              <div className="w-full h-24 rounded-xl bg-white/5 mb-4 flex items-center justify-center">
                <BookOpen size={28} style={{ color }} weight="duotone" />
              </div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-white text-xs font-semibold leading-snug line-clamp-2">{title}</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[#555] text-xs">{members} members</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    status === 'Active'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-white/5 text-[#555]'
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-1.5 rounded-lg bg-white/5 text-[#888] text-xs hover:bg-white/10 hover:text-white transition-colors">
                  Edit
                </button>
                <button className="flex-1 py-1.5 rounded-lg bg-white/5 text-[#aaa] text-xs hover:bg-white/10 hover:text-white transition-colors">
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
