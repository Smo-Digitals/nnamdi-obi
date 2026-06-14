'use client';

import { BookOpen, Play, Users, ArrowRight, Fire, Clock, CheckCircle } from 'phosphor-react';

const inProgress = [
  { title: 'Business Growth Masterclass', progress: 65, lessons: 24, done: 15, color: '#DC5B17' },
  { title: 'Tech Foundations',            progress: 30, lessons: 18, done: 5,  color: '#22c55e' },
  { title: 'Leadership 101',              progress: 10, lessons: 12, done: 1,  color: '#eab308' },
];

const explore = [
  { title: 'Personal Finance Basics', members: 50,  tag: 'Finance',   color: '#8b5cf6' },
  { title: 'Building in Public',      members: 120, tag: 'Growth',    color: '#DC5B17' },
  { title: 'Sales Psychology',        members: 89,  tag: 'Sales',     color: '#22c55e' },
  { title: 'Content Creation 101',    members: 200, tag: 'Marketing', color: '#f43f5e' },
];

const activity = [
  { name: 'Adaeze O.', action: 'completed', item: 'Module 3 — Business Growth',   time: '5m ago' },
  { name: 'Emeka N.',  action: 'joined',    item: 'Tech Foundations',              time: '12m ago' },
  { name: 'Chioma E.', action: 'commented', item: '"This changed my perspective"', time: '1h ago' },
  { name: 'Tunde A.',  action: 'completed', item: 'Leadership 101 — Intro',        time: '2h ago' },
];

const actionColors: Record<string, string> = {
  completed: 'text-green-500',
  joined:    'text-[#DC5B17]',
  commented: 'text-blue-500',
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 p-8 max-w-6xl">

      {/* Welcome banner */}
      <div className="relative rounded-2xl overflow-hidden border px-8 py-10"
        style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, #DC5B17 15%, var(--adm-card)), var(--adm-card))',
          borderColor: 'color-mix(in srgb, #DC5B17 25%, var(--adm-border))',
        }}>
        <div className="relative z-10">
          <p className="text-[#DC5B17] text-sm font-semibold mb-1">Good morning 👋</p>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--adm-text)' }}>Welcome back, Nnamdi</h1>
          <p className="text-sm max-w-md" style={{ color: 'var(--adm-muted)' }}>
            You have <span className="font-semibold" style={{ color: 'var(--adm-text)' }}>2 courses in progress</span>. Pick up where you left off.
          </p>
          <button className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">
            <Play size={14} weight="fill" /> Continue learning
          </button>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-[#DC5B17]/10 blur-3xl pointer-events-none" />
      </div>

      {/* Continue learning */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Fire size={17} weight="fill" className="text-[#DC5B17]" />
            <h2 className="font-semibold" style={{ color: 'var(--adm-text)' }}>Continue Learning</h2>
          </div>
          <button className="flex items-center gap-1 text-xs transition-colors" style={{ color: 'var(--adm-muted)' }}>
            View all <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inProgress.map(({ title, progress, lessons, done, color }) => (
            <div key={title} className="rounded-2xl p-5 border cursor-pointer group transition-all hover:shadow-sm"
              style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
              <div className="w-full h-28 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: 'var(--adm-surface, var(--adm-pill))' }}>
                <BookOpen size={32} style={{ color }} weight="duotone" />
                <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 30% 50%, ${color}, transparent 70%)` }} />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Play size={16} weight="fill" className="text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-semibold mb-3 line-clamp-2" style={{ color: 'var(--adm-text)' }}>{title}</h3>
              <div className="mb-2">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--adm-border)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: color }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--adm-muted)' }}>{done}/{lessons} lessons</span>
                <span className="text-xs font-semibold" style={{ color }}>{progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity + Explore */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Community activity */}
        <section className="lg:col-span-2 rounded-2xl p-6 border"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Users size={16} weight="fill" className="text-[#DC5B17]" />
            <h2 className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>Community Activity</h2>
          </div>
          <div className="flex flex-col gap-4">
            {activity.map(({ name, action, item, time }) => (
              <div key={name + time} className="flex gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold"
                  style={{ backgroundColor: 'var(--adm-pill)', color: 'var(--adm-muted)' }}>
                  {name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed">
                    <span className="font-medium" style={{ color: 'var(--adm-text)' }}>{name}</span>{' '}
                    <span className={actionColors[action] ?? ''}>{action}</span>{' '}
                    <span style={{ color: 'var(--adm-muted)' }} className="truncate">{item}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock size={10} style={{ color: 'var(--adm-muted)' }} />
                    <span className="text-[10px]" style={{ color: 'var(--adm-muted)' }}>{time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Explore courses */}
        <section className="lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>Explore Courses</h2>
            <button className="flex items-center gap-1 text-xs transition-colors" style={{ color: 'var(--adm-muted)' }}>
              Browse all <ArrowRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {explore.map(({ title, members, tag, color }) => (
              <div key={title} className="rounded-xl p-4 border cursor-pointer group flex items-center gap-4 transition-all hover:shadow-sm"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}20` }}>
                  <BookOpen size={18} style={{ color }} weight="duotone" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold line-clamp-1 mb-1" style={{ color: 'var(--adm-text)' }}>{title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${color}20`, color }}>
                      {tag}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--adm-muted)' }}>{members} members</span>
                  </div>
                </div>
                <ArrowRight size={14} className="shrink-0 transition-colors" style={{ color: 'var(--adm-muted)' }} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Achievements */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <CheckCircle size={17} weight="fill" className="text-green-500" />
          <h2 className="font-semibold" style={{ color: 'var(--adm-text)' }}>Your Achievements</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'First Course',    desc: 'Enrolled in your first course',   done: true  },
            { label: 'Halfway There',   desc: 'Reached 50% on any course',       done: true  },
            { label: 'Community Pro',   desc: 'Made 10 community contributions', done: false },
            { label: 'Course Complete', desc: 'Finished your first full course', done: false },
          ].map(({ label, desc, done }) => (
            <div key={label} className="rounded-xl p-4 border text-center transition-colors"
              style={{
                backgroundColor: done ? 'rgba(34,197,94,0.08)' : 'var(--adm-card)',
                borderColor:     done ? 'rgba(34,197,94,0.2)'  : 'var(--adm-border)',
                opacity:         done ? 1 : 0.5,
              }}>
              <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: done ? 'rgba(34,197,94,0.15)' : 'var(--adm-pill)' }}>
                <CheckCircle size={16} weight="fill" className={done ? 'text-green-500' : ''} style={done ? {} : { color: 'var(--adm-muted)' }} />
              </div>
              <p className="text-xs font-semibold mb-1" style={{ color: done ? 'var(--adm-text)' : 'var(--adm-muted)' }}>{label}</p>
              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--adm-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
