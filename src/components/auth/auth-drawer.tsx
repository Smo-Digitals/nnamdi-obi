'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X } from '@/components/icons';
import { login } from '@/app/(auth)/actions';
import { SubmitButton } from './submit-button';
import { PasswordInput } from './password-input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDrawer({ isOpen, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed top-4 right-4 bottom-4 w-[calc(100%-2rem)] sm:w-[820px] z-50
                    bg-[#080808] border border-[#1c1c1c] rounded-2xl overflow-hidden
                    shadow-2xl shadow-black/70
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)]'}`}
      >
        <div className="grid h-full grid-cols-1 sm:grid-cols-[280px_1fr]">

          {/* ── Left: branding panel ── */}
          <div className="hidden sm:flex flex-col bg-[#050505] border-r border-[#141414] p-9">

            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-sm bg-[#677db7]" />
              <span className="font-display text-[11px] tracking-[0.2em] text-[#f0ede8]">
                NNAMDI OBI
              </span>
            </div>

            <div className="flex-1" />

            {/* Tagline */}
            <p className="font-body text-[11px] leading-[1.9] text-[#383838] mb-10 max-w-[180px]">
              Access the community. Read essays, follow projects, and stay connected to the work.
            </p>

            {/* Nav links */}
            <div className="flex flex-col gap-3">
              {[
                { label: 'About',     href: '/about' },
                { label: 'Community', href: '/community' },
                { label: 'Contact',   href: '/contact' },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={onClose}
                  className="font-body text-[9px] tracking-[0.3em] uppercase text-[#2a2a2a] hover:text-[#677db7] transition-colors w-fit"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Right: form panel ── */}
          <div className="flex flex-col px-10 py-9 overflow-y-auto">

            {/* Header row */}
            <div className="flex items-center justify-between mb-12">
              <span className="font-body text-[9px] tracking-[0.5em] text-[#677db7]">
                [ AUTH ]
              </span>
              <button
                onClick={onClose}
                aria-label="Close"
                className="text-[#333] hover:text-[#f0ede8] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Heading */}
            <h2 className="font-display text-[72px] leading-[0.85] tracking-tight text-[#f0ede8] mb-10">
              SIGN<br />IN.
            </h2>

            {/* Form */}
            <form action={login} className="flex flex-col gap-7 flex-1">
              <div className="flex flex-col gap-2">
                <label className="font-body text-[9px] tracking-[0.4em] uppercase text-[#444]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="bg-transparent border-b border-[#222] focus:border-[#677db7]
                             py-3 font-body text-[13px] text-[#f0ede8]
                             outline-none transition-colors placeholder:text-[#2a2a2a] rounded-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-body text-[9px] tracking-[0.4em] uppercase text-[#444]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="font-body text-[9px] tracking-[0.15em] text-[#333] hover:text-[#677db7] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput name="password" />
              </div>

              <SubmitButton label="Sign In" pendingLabel="Signing in..." />
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-[#111] flex items-center justify-between">
              <span className="font-body text-[9px] tracking-[0.2em] text-[#2a2a2a]">
                No account yet?
              </span>
              <Link
                href="/signup"
                onClick={onClose}
                className="font-body text-[9px] tracking-[0.3em] uppercase text-[#677db7] hover:text-[#f0ede8] transition-colors"
              >
                Create one →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
