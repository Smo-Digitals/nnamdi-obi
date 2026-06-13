'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SquaresFour,
  ChartBar,
  BookOpen,
  Users,
  Gear,
  Lightning,
  Folder,
  SignOut,
  CaretLeft,
  CaretRight,
} from 'phosphor-react';
import { adminLogout } from '@/app/(auth)/actions';

const nav = [
  { href: '/admin',           label: 'Dashboard', icon: SquaresFour },
  { href: '/admin/analytics', label: 'Analytics', icon: ChartBar },
  { href: '/admin/courses',   label: 'Courses',   icon: BookOpen },
  { href: '/admin/members',   label: 'Members',   icon: Users },
  { href: '/admin/settings',  label: 'Settings',  icon: Gear },
];

const folders = [
  { label: 'Free content',    color: '#DC5B17' },
  { label: 'Paid courses',    color: '#888' },
  { label: 'Community posts', color: '#eab308' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`shrink-0 h-screen flex flex-col bg-[#080808] border-r border-white/[0.06] overflow-y-auto overflow-x-hidden transition-all duration-300 ${
        collapsed ? 'w-[64px]' : 'w-[240px]'
      }`}
    >
      {/* Brand + collapse toggle */}
      <div className={`flex items-center border-b border-white/5 h-16 shrink-0 ${collapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}>
        <div className="w-8 h-8 rounded-lg bg-[#DC5B17] flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold font-[family-name:var(--font-dm-mono)]">N</span>
        </div>
        {!collapsed && (
          <span className="text-white font-semibold text-sm flex-1 truncate">Nnamdi Obi</span>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-6 h-6 flex items-center justify-center rounded-md text-[#444] hover:text-white hover:bg-white/5 transition-colors"
          >
            <CaretLeft size={13} />
          </button>
        )}
      </div>

      {/* Collapse toggle when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-3 w-8 h-8 flex items-center justify-center rounded-lg text-[#444] hover:text-white hover:bg-white/5 transition-colors"
        >
          <CaretRight size={14} />
        </button>
      )}

      {/* Nav */}
      <nav className={`flex flex-col gap-0.5 pt-4 ${collapsed ? 'px-2' : 'px-3'}`}>
        {!collapsed && (
          <p className="text-[10px] font-semibold text-[#333] uppercase tracking-wider px-3 mb-1">Menu</p>
        )}
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center rounded-lg text-sm transition-colors ${
                collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3 py-2'
              } ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-[#666] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={17} weight={active ? 'fill' : 'regular'} />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Folders */}
      {!collapsed && (
        <div className="px-3 mt-6">
          <p className="text-[10px] font-semibold text-[#333] uppercase tracking-wider px-3 mb-1">Content</p>
          {folders.map(({ label, color }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#666] hover:text-white hover:bg-white/5 transition-colors"
            >
              <Folder size={15} style={{ color }} weight="fill" />
              {label}
            </button>
          ))}
        </div>
      )}

      {collapsed && (
        <div className="px-2 mt-6 flex flex-col gap-0.5">
          {folders.map(({ label, color }) => (
            <button
              key={label}
              title={label}
              className="w-10 h-10 mx-auto flex items-center justify-center rounded-lg text-[#666] hover:text-white hover:bg-white/5 transition-colors"
            >
              <Folder size={15} style={{ color }} weight="fill" />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1" />

      {/* Upgrade card */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.07]">
          <div className="flex items-center gap-2 mb-2">
            <Lightning size={16} weight="fill" className="text-[#DC5B17]" />
            <span className="text-white text-xs font-semibold">Upgrade to Pro</span>
          </div>
          <p className="text-[#555] text-xs mb-3 leading-relaxed">
            Unlock unlimited members, custom domain & analytics.
          </p>
          <button className="w-full py-1.5 rounded-lg bg-[#DC5B17] text-white text-xs font-semibold hover:bg-[#c44f13] transition-colors">
            Upgrade Now
          </button>
        </div>
      )}

      {collapsed && (
        <div className="px-2 mb-3">
          <button
            title="Upgrade to Pro"
            className="w-10 h-10 mx-auto flex items-center justify-center rounded-lg text-[#DC5B17] hover:bg-white/5 transition-colors"
          >
            <Lightning size={17} weight="fill" />
          </button>
        </div>
      )}

      {/* Sign out */}
      <form action={adminLogout} className={`pb-4 ${collapsed ? 'px-2' : 'px-3'}`}>
        <button
          type="submit"
          title={collapsed ? 'Sign out' : undefined}
          className={`flex items-center rounded-lg text-sm text-[#444] hover:text-red-400 hover:bg-white/5 transition-colors ${
            collapsed ? 'justify-center w-10 h-10 mx-auto' : 'w-full gap-3 px-3 py-2'
          }`}
        >
          <SignOut size={15} />
          {!collapsed && 'Sign out'}
        </button>
      </form>
    </aside>
  );
}
