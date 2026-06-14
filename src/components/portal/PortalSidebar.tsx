'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House, BookOpen, UsersThree, CalendarBlank,
  Storefront, CalendarCheck, UserCircle, Gear,
  SignOut, CaretRight, ChatCircle,
} from 'phosphor-react';
import { logout } from '@/app/(auth)/actions';

type NavItem = { label: string; href: string; icon: React.ElementType };

const SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Main',
    items: [
      { label: 'Home',       href: '/home',           icon: House },
      { label: 'Courses',    href: '/home/courses',    icon: BookOpen },
      { label: 'Community',  href: '/home/community',  icon: UsersThree },
      { label: 'Events',     href: '/home/events',     icon: CalendarBlank },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { label: 'Marketplace', href: '/home/marketplace', icon: Storefront },
      { label: 'Bookings',    href: '/home/bookings',    icon: CalendarCheck },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Messages',  href: '/home/messages',  icon: ChatCircle },
      { label: 'Profile',   href: '/home/profile',   icon: UserCircle },
      { label: 'Settings',  href: '/home/settings',  icon: Gear },
    ],
  },
];

export function PortalSidebar() {
  const pathname  = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`shrink-0 h-screen flex flex-col border-r overflow-y-auto overflow-x-hidden transition-all duration-300 ${collapsed ? 'w-[64px]' : 'w-[220px]'}`}
      style={{ backgroundColor: 'var(--adm-sidebar)', borderColor: 'var(--adm-border)' }}
    >
      {/* Brand */}
      <div className="flex items-center border-b h-20 shrink-0 px-4 gap-3" style={{ borderColor: 'var(--adm-border)' }}>
        {collapsed ? (
          <button onClick={() => setCollapsed(false)} title="Expand"
            className="w-8 h-8 rounded-lg bg-[#DC5B17] flex items-center justify-center hover:bg-[#c44f13] transition-colors">
            <span className="text-white text-sm font-bold">N</span>
          </button>
        ) : (
          <>
            <div className="w-8 h-8 rounded-lg bg-[#DC5B17] flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <span className="font-semibold text-sm flex-1 truncate" style={{ color: 'var(--adm-text)' }}>Nnamdi Obi</span>
            <button onClick={() => setCollapsed(true)} title="Collapse"
              className="w-6 h-6 flex items-center justify-center rounded-md text-[#444] hover:text-white hover:bg-white/5 transition-colors">
              <CaretRight size={12} weight="bold" className="rotate-180" />
            </button>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-4">
        {SECTIONS.map(({ label, items }) => (
          <div key={label}>
            {!collapsed && (
              <p className="text-[#333] text-[10px] font-semibold uppercase tracking-widest px-2 mb-1.5">{label}</p>
            )}
            <div className="flex flex-col gap-0.5">
              {items.map(({ label: name, href, icon: Icon }) => {
                const active = href === '/home' ? pathname === '/home' : pathname.startsWith(href);
                return collapsed ? (
                  <Link key={href} href={href} title={name}
                    className={`flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-colors ${
                      active ? 'bg-[#DC5B17]/15 text-[#DC5B17]' : 'text-[#555] hover:text-white hover:bg-white/5'
                    }`}>
                    <Icon size={18} />
                  </Link>
                ) : (
                  <Link key={href} href={href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      active ? 'bg-white/[0.06] text-white' : 'text-[#555] hover:text-white hover:bg-white/[0.04]'
                    }`}>
                    <Icon size={15} className={active ? 'text-[#DC5B17]' : ''} />
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign out */}
      {!collapsed && (
        <div className="p-3 border-t shrink-0" style={{ borderColor: 'var(--adm-border)' }}>
          <form action={logout}>
            <button type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#444] hover:text-red-400 hover:bg-red-400/5 transition-colors text-xs">
              <SignOut size={15} />
              Sign out
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
