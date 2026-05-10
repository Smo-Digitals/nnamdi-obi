'use client';

import Link from 'next/link';
import { useState } from 'react';
import { List, X } from 'phosphor-react';

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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1c1c1c] bg-[#0a0a0a]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl tracking-[0.15em] text-[#f0ede8] hover:text-[#677db7] transition-colors"
        >
          NNAMDI OBI
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-[10px] tracking-[0.2em] uppercase text-[#555] hover:text-[#f0ede8] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#555] hover:text-[#f0ede8] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <List size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-[#1c1c1c] bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-body text-xs tracking-[0.2em] uppercase text-[#555] hover:text-[#f0ede8] transition-colors py-3 border-b border-[#1c1c1c]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
