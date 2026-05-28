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
        className={`fixed inset-0 z-40 bg-black/80 transition-opacity duration-400 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel — floating card */}
      <div
        className={`fixed top-4 right-4 bottom-4 w-[calc(100%-2rem)] sm:w-[580px] z-50
                    bg-[#080808] border border-[#1e1e1e]
                    rounded-2xl flex flex-col px-10 py-8
                    shadow-2xl shadow-black/60
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+1rem)]'}`}
      >
        {/* Top row */}
        <div className="flex items-center justify-between mb-16">
          <span className="font-body text-[9px] tracking-[0.5em] text-[#677db7]">[ AUTH ]</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[#333] hover:text-[#f0ede8] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Heading */}
        <div className="mb-12">
          <h2
            className="font-display text-[80px] leading-[0.85] tracking-tight text-[#f0ede8]"
          >
            SIGN<br />IN.
          </h2>
        </div>

        {/* Form — bottom-border inputs, no box */}
        <form action={login} className="flex flex-col gap-8 flex-1">
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
                         outline-none transition-colors placeholder:text-[#2a2a2a]
                         rounded-none"
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
                Forgot?
              </Link>
            </div>
            <PasswordInput name="password" />
          </div>

          <div className="mt-2">
            <SubmitButton label="Sign In" pendingLabel="Signing in..." />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between pt-8 border-t border-[#111]">
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
    </>
  );
}
