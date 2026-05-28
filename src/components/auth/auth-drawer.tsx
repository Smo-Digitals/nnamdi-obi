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
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 bg-[#060606] border-l border-[#1c1c1c] flex flex-col p-8 sm:p-10 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <span className="font-body text-[10px] tracking-[0.4em] text-[#677db7]">[ AUTH ]</span>
            <div className="w-8 h-px bg-[#1c1c1c]" />
          </div>
          <button
            onClick={onClose}
            className="text-[#444] hover:text-[#f0ede8] transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Heading */}
        <h2 className="font-display text-[52px] leading-[0.9] tracking-tight text-[#f0ede8] mb-2">
          SIGN IN
        </h2>
        <p className="font-body text-[10px] tracking-[0.35em] text-[#333] mb-10">
          ACCESS YOUR ACCOUNT
        </p>

        {/* Form */}
        <form action={login} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-body text-[9px] tracking-[0.35em] uppercase text-[#444]">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="bg-transparent border border-[#1c1c1c] focus:border-[#677db7] px-4 py-3 font-body text-sm text-[#f0ede8] outline-none transition-colors placeholder:text-[#2a2a2a]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-body text-[9px] tracking-[0.35em] uppercase text-[#444]">
              Password
            </label>
            <PasswordInput name="password" />
          </div>

          <SubmitButton label="Sign In" pendingLabel="Signing in..." />
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#1c1c1c] flex items-center justify-between">
          <p className="font-body text-[9px] text-[#333] tracking-[0.2em]">No account yet?</p>
          <Link
            href="/signup"
            onClick={onClose}
            className="font-body text-[9px] tracking-[0.25em] uppercase text-[#677db7] hover:text-[#f0ede8] transition-colors"
          >
            Create one →
          </Link>
        </div>
      </div>
    </>
  );
}
