'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, MagnifyingGlass, BookOpen, House, Users, UserCircle } from 'phosphor-react';

const links = [
  { href: '/home',            label: 'Home',      icon: House },
  { href: '/home/courses',    label: 'Courses',   icon: BookOpen },
  { href: '/home/community',  label: 'Community', icon: Users },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2.5 shrink-0 mr-4">
          <div className="w-7 h-7 rounded-lg bg-[#DC5B17] flex items-center justify-center">
            <span className="text-white text-xs font-bold font-[family-name:var(--font-dm-mono)]">N</span>
          </div>
          <span className="text-white font-semibold text-sm hidden sm:block">Nnamdi Obi</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1 flex-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  active ? 'text-white bg-white/10' : 'text-[#666] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={15} weight={active ? 'fill' : 'regular'} />
                <span className="hidden sm:block">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-[#666] hover:text-white hover:bg-white/5 transition-colors">
            <MagnifyingGlass size={17} />
          </button>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#666] hover:text-white hover:bg-white/5 transition-colors">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC5B17]" />
          </button>
          <button className="w-9 h-9 rounded-full bg-[#DC5B17]/20 flex items-center justify-center text-[#DC5B17] text-sm font-semibold hover:bg-[#DC5B17]/30 transition-colors">
            N
          </button>
        </div>
      </div>
    </header>
  );
}
