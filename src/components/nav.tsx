'use client';

import Link from 'next/link';
import { useState } from 'react';
import { List, X } from '@/components/icons';

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/community', label: 'Community' },
  { href: '/build', label: 'Build With Me' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating pill nav */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="w-full max-w-3xl bg-[#111111] border border-[#242424] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-2 px-3 py-2">

          {/* Logomark */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-1">
            <div className="w-8 h-8 rounded-full bg-[#677db7] flex items-center justify-center shrink-0">
              <span className="font-display text-[13px] text-[#f0ede8] leading-none tracking-wide">
                NO
              </span>
            </div>
            <span className="hidden lg:block font-display text-sm tracking-[0.15em] text-[#f0ede8]">
              NNAMDI OBI
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 font-body text-[11px] tracking-[0.12em] text-[#666] hover:text-[#f0ede8] hover:bg-white/5 rounded-xl transition-all whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA button */}
          <Link
            href="/contact"
            className="hidden md:block ml-auto shrink-0 bg-[#f0ede8] text-[#0a0a0a] font-body text-[11px] tracking-[0.12em] px-4 py-2 rounded-xl hover:bg-white transition-colors"
          >
            Get in touch
          </Link>

          {/* Mobile toggle */}
          <button
            className="md:hidden ml-auto text-[#666] hover:text-[#f0ede8] transition-colors p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <List size={16} />}
          </button>
        </nav>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="fixed top-[72px] left-4 right-4 z-40 bg-[#111111] border border-[#242424] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-3 md:hidden">
          <div className="flex flex-col gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 font-body text-xs tracking-[0.12em] text-[#666] hover:text-[#f0ede8] hover:bg-white/5 rounded-xl transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-1 pt-2 border-t border-[#242424]">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block text-center bg-[#f0ede8] text-[#0a0a0a] font-body text-xs tracking-[0.12em] px-4 py-2.5 rounded-xl hover:bg-white transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
