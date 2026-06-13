'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SquaresFour,
  ChartBar,
  BookOpen,
  Users,
  Gear,
  MagnifyingGlass,
  Lightning,
  Plus,
  Folder,
  SignOut,
} from 'phosphor-react';
import { logout } from '@/app/(auth)/actions';

const nav = [
  { href: '/admin',            label: 'Dashboard',    icon: SquaresFour },
  { href: '/admin/analytics',  label: 'Analytics',    icon: ChartBar },
  { href: '/admin/courses',    label: 'Courses',      icon: BookOpen },
  { href: '/admin/members',    label: 'Members',      icon: Users },
  { href: '/admin/settings',   label: 'Settings',     icon: Gear },
];

const folders = [
  { label: 'Free content',    color: '#DC5B17' },
  { label: 'Paid courses',    color: '#888' },
  { label: 'Community posts', color: '#eab308' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] shrink-0 h-screen flex flex-col bg-[#111] border-r border-white/5 overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-[#DC5B17] flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold font-[family-name:var(--font-dm-mono)]">N</span>
        </div>
        <span className="text-white font-semibold text-sm">Nnamdi Obi</span>
      </div>

      {/* Search */}
      <div className="px-3 pt-4 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-[#666] text-sm">
          <MagnifyingGlass size={14} />
          <span className="flex-1 text-xs">Search…</span>
          <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-[#555]">/</kbd>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 pt-2">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-[#888] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} weight={active ? 'fill' : 'regular'} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Folders */}
      <div className="px-3 mt-6">
        <p className="text-[10px] font-semibold text-[#444] uppercase tracking-wider px-3 mb-2">Content</p>
        {folders.map(({ label, color }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#888] hover:text-white hover:bg-white/5 transition-colors"
          >
            <Folder size={15} style={{ color }} weight="fill" />
            {label}
          </button>
        ))}
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#555] hover:text-white hover:bg-white/5 transition-colors mt-1">
          <Plus size={14} />
          Create folder
        </button>
      </div>

      <div className="flex-1" />

      {/* Upgrade card */}
      <div className="mx-3 mb-3 p-4 rounded-xl bg-[#DC5B17]/10 border border-[#DC5B17]/20">
        <div className="flex items-center gap-2 mb-2">
          <Lightning size={16} weight="fill" className="text-[#DC5B17]" />
          <span className="text-white text-xs font-semibold">Upgrade to Pro</span>
        </div>
        <p className="text-[#aaa] text-xs mb-3 leading-relaxed">
          Unlock unlimited members, custom domain & analytics.
        </p>
        <button className="w-full py-1.5 rounded-lg bg-[#DC5B17] text-white text-xs font-semibold hover:bg-[#c44f13] transition-colors">
          Upgrade Now
        </button>
      </div>

      {/* Sign out */}
      <form action={logout} className="px-3 pb-4">
        <button
          type="submit"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#555] hover:text-red-400 hover:bg-white/5 transition-colors"
        >
          <SignOut size={15} />
          Sign out
        </button>
      </form>
    </aside>
  );
}
