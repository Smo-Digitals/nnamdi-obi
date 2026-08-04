'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SquaresFour, X } from 'phosphor-react';
import { LogoMark } from '@/components/Logo';

const NAV = [
  { label: 'Home',      href: '/' },
  { label: 'About',     href: '/about' },
  { label: 'Academy',   href: '/academy' },
  { label: 'Resources', href: '/resources' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 sm:px-6 pt-4">
      <div className="w-full sm:w-auto flex flex-col rounded-xl bg-black border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="flex items-center justify-between gap-8 pl-5 pr-2 py-2">
          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
            <LogoMark size={26} />
            <span className="text-white font-semibold text-sm">Nnamdi Obi</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {NAV.map((link) => (
              <Link key={link.href} href={link.href} className="group relative h-5 overflow-hidden">
                <span className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-1/2">
                  <span className="text-[#999]">{link.label}</span>
                  <span className="text-white">{link.label}</span>
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden sm:block shrink-0">
            <Link href="/login" className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors">
              Login
            </Link>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-colors shrink-0"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <SquaresFour size={20} weight="bold" />}
          </button>
        </div>

        {open && (
          <div className="sm:hidden border-t border-white/10 px-5 py-4 flex flex-col gap-4">
            {NAV.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm text-[#ccc] hover:text-white transition-colors">{link.label}</Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold">
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
