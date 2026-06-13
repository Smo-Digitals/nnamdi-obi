'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SquaresFour, PencilSimpleLine, BookOpen, Storefront,
  CalendarBlank, UsersThree, CalendarCheck, CurrencyDollar,
  EnvelopeSimple, ChartBar, Users, CaretDown, CaretRight,
  SignOut,
} from 'phosphor-react';
import { adminLogout } from '@/app/(auth)/actions';

type SubItem = { label: string; href: string };
type NavGroup = {
  id:       string;
  label:    string;
  icon:     React.ElementType;
  items:    SubItem[];
  basePath: string;
};

const NAV: NavGroup[] = [
  {
    id: 'dashboard', label: 'Dashboard', icon: SquaresFour, basePath: '/admin',
    items: [
      { label: 'Overview',       href: '/admin' },
      { label: 'Announcements',  href: '/admin/announcements' },
      { label: 'Media',          href: '/admin/media' },
      { label: 'Homepage',       href: '/admin/homepage' },
    ],
  },
  {
    id: 'writing', label: 'Writing', icon: PencilSimpleLine, basePath: '/admin/writing',
    items: [
      { label: 'All Posts',     href: '/admin/writing/posts' },
      { label: 'Create Post',   href: '/admin/writing/create' },
      { label: 'Categories',    href: '/admin/writing/categories' },
      { label: 'Post Metrics',  href: '/admin/writing/metrics' },
      { label: 'Curated',       href: '/admin/writing/curated' },
      { label: 'Comments',      href: '/admin/writing/comments' },
      { label: 'Editors',       href: '/admin/writing/editors' },
    ],
  },
  {
    id: 'courses', label: 'Courses', icon: BookOpen, basePath: '/admin/courses',
    items: [
      { label: 'Roadmaps',        href: '/admin/courses/roadmaps' },
      { label: 'All Courses',     href: '/admin/courses/all' },
      { label: 'Curated Content', href: '/admin/courses/curated' },
      { label: 'Categories',      href: '/admin/courses/categories' },
      { label: 'Bundles',         href: '/admin/courses/bundles' },
      { label: 'Files',           href: '/admin/courses/files' },
      { label: 'Course Metrics',  href: '/admin/courses/metrics' },
    ],
  },
  {
    id: 'marketplace', label: 'Market Place', icon: Storefront, basePath: '/admin/marketplace',
    items: [
      { label: 'Templates',     href: '/admin/marketplace/templates' },
      { label: 'Group Buy',     href: '/admin/marketplace/group-buy' },
      { label: 'Partnerships',  href: '/admin/marketplace/partnerships' },
    ],
  },
  {
    id: 'events', label: 'Events', icon: CalendarBlank, basePath: '/admin/events',
    items: [
      { label: 'Curated',     href: '/admin/events/curated' },
      { label: 'Private',     href: '/admin/events/private' },
      { label: 'Live Event',  href: '/admin/events/live' },
    ],
  },
  {
    id: 'community', label: 'Community', icon: UsersThree, basePath: '/admin/community',
    items: [
      { label: 'Active',   href: '/admin/community/active' },
      { label: 'Create',   href: '/admin/community/create' },
      { label: 'Members',  href: '/admin/community/members' },
    ],
  },
  {
    id: 'booking', label: 'Booking', icon: CalendarCheck, basePath: '/admin/booking',
    items: [
      { label: 'Create',      href: '/admin/booking/create' },
      { label: 'Categories',  href: '/admin/booking/categories' },
      { label: 'Bookings',    href: '/admin/booking/all' },
    ],
  },
  {
    id: 'financials', label: 'Financials', icon: CurrencyDollar, basePath: '/admin/financials',
    items: [
      { label: 'Earnings',      href: '/admin/financials/earnings' },
      { label: 'Money Metrics', href: '/admin/financials/metrics' },
    ],
  },
  {
    id: 'emails', label: 'Emails', icon: EnvelopeSimple, basePath: '/admin/emails',
    items: [
      { label: 'Newsletters',  href: '/admin/emails/newsletters' },
      { label: 'All Letters',  href: '/admin/emails/all' },
      { label: 'Issues',       href: '/admin/emails/issues' },
      { label: 'Updates',      href: '/admin/emails/updates' },
    ],
  },
  {
    id: 'analytics', label: 'Analytics', icon: ChartBar, basePath: '/admin/analytics',
    items: [
      { label: 'Finance',  href: '/admin/analytics/finance' },
      { label: 'Users',    href: '/admin/analytics/users' },
      { label: 'App',      href: '/admin/analytics/app' },
    ],
  },
  {
    id: 'users', label: 'Users', icon: Users, basePath: '/admin/users',
    items: [
      { label: 'All Users',  href: '/admin/users/all' },
      { label: 'Editors',    href: '/admin/users/editors' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed,   setCollapsed]   = useState(false);
  const [openGroups,  setOpenGroups]  = useState<string[]>(() => {
    const active = NAV.find((g) =>
      g.id === 'dashboard'
        ? pathname === '/admin' || pathname.startsWith('/admin/announcements') || pathname.startsWith('/admin/media') || pathname.startsWith('/admin/homepage')
        : pathname.startsWith(g.basePath)
    );
    return active ? [active.id] : ['dashboard'];
  });

  useEffect(() => {
    const active = NAV.find((g) =>
      g.id === 'dashboard'
        ? pathname === '/admin' || g.items.some((i) => pathname === i.href)
        : pathname.startsWith(g.basePath)
    );
    if (active && !openGroups.includes(active.id)) {
      setOpenGroups((prev) => [...prev, active.id]);
    }
  }, [pathname]);

  function toggle(id: string) {
    setOpenGroups((prev) =>
      prev.includes(id) ? [] : [id]
    );
  }

  return (
    <aside
      className={`shrink-0 h-screen flex flex-col border-r overflow-y-auto overflow-x-hidden transition-all duration-300 ${collapsed ? 'w-[64px]' : 'w-[220px]'}`}
      style={{ backgroundColor: 'var(--adm-sidebar)', borderColor: 'var(--adm-border)' }}
    >
      {/* Brand */}
      <div
        className={`flex items-center border-b h-20 shrink-0 ${collapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
        style={{ borderColor: 'var(--adm-border)' }}
      >
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            className="w-8 h-8 rounded-lg bg-[#DC5B17] flex items-center justify-center hover:bg-[#c44f13] transition-colors"
          >
            <span className="text-white text-sm font-bold">N</span>
          </button>
        ) : (
          <>
            <div className="w-8 h-8 rounded-lg bg-[#DC5B17] flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <span className="text-white font-semibold text-sm flex-1 truncate">Nnamdi Obi</span>
            <button
              onClick={() => setCollapsed(true)}
              className="w-6 h-6 flex items-center justify-center rounded-md text-[#444] hover:text-white hover:bg-white/5 transition-colors"
              title="Collapse sidebar"
            >
              <CaretRight size={12} weight="bold" className="rotate-180" />
            </button>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {!collapsed && (
          <p className="text-[#333] text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">Menu</p>
        )}

        {NAV.map((group) => {
          const Icon     = group.icon;
          const isOpen   = openGroups.includes(group.id);
          const isActive = group.id === 'dashboard'
            ? pathname === '/admin' || group.items.some((i) => i.href !== '/admin' && pathname.startsWith(i.href))
            : pathname.startsWith(group.basePath);

          if (collapsed) {
            return (
              <Link
                key={group.id}
                href={group.items[0].href}
                title={group.label}
                className={`flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[#DC5B17]/15 text-[#DC5B17]'
                    : 'text-[#555] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
              </Link>
            );
          }

          return (
            <div key={group.id}>
              {/* Group header */}
              <button
                onClick={() => toggle(group.id)}
                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-left transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-[#555] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#DC5B17]' : ''} />
                <span className="flex-1 text-xs font-semibold">{group.label}</span>
                <CaretDown
                  size={11}
                  className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
                />
              </button>

              {/* Sub-items */}
              {isOpen && (
                <div className="mt-0.5 ml-6 border-l pl-2 mb-1" style={{ borderColor: 'var(--adm-border)' }}>
                  {group.items.map((item) => {
                    const itemActive = item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-2 py-1.5 rounded-lg text-xs transition-colors ${
                          itemActive
                            ? 'text-white bg-white/[0.06] font-medium'
                            : 'text-[#555] hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sign out */}
      {!collapsed && (
        <div className="p-3 border-t shrink-0" style={{ borderColor: 'var(--adm-border)' }}>
          <form action={adminLogout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#444] hover:text-red-400 hover:bg-red-400/5 transition-colors text-xs"
            >
              <SignOut size={15} />
              Sign out
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
