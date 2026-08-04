'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, SquaresFour, X } from 'phosphor-react';
import { LogoMark } from '@/components/Logo';

type NavLink = { label: string; href: string };

export function SiteHeader({ nav = [], showSignIn = true }: { nav?: NavLink[]; showSignIn?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 sm:px-6 pt-4">
      <div className="w-full sm:w-auto flex flex-col rounded-xl bg-black border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="flex items-center justify-between gap-8 pl-5 pr-2 py-2">
          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
            <LogoMark size={26} />
            <span className="text-white font-semibold text-sm">Nnamdi Obi</span>
          </Link>

          {nav.length > 0 && (
            <nav className="hidden md:flex items-center gap-6 text-sm text-[#999]">
              {nav.map((link) =>
                link.href.startsWith('#') ? (
                  <a key={link.href} href={link.href} className="hover:text-white transition-colors">{link.label}</a>
                ) : (
                  <Link key={link.href} href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                )
              )}
            </nav>
          )}

          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {showSignIn && (
              <Link href="/login" className="text-sm text-[#999] hover:text-white transition-colors px-2">Sign in</Link>
            )}
            <Link href="/signup" className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors">
              Join now <ArrowRight size={14} />
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
            {nav.map((link) =>
              link.href.startsWith('#') ? (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm text-[#ccc] hover:text-white transition-colors">{link.label}</a>
              ) : (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm text-[#ccc] hover:text-white transition-colors">{link.label}</Link>
              )
            )}
            {showSignIn && (
              <Link href="/login" onClick={() => setOpen(false)} className="text-sm text-[#ccc] hover:text-white transition-colors">Sign in</Link>
            )}
            <Link href="/signup" onClick={() => setOpen(false)} className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold">
              Join now <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
