'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { X, Eye, EyeSlash } from '@/components/icons';
import { login } from '@/app/(auth)/actions';
import { GoogleSignInButton } from './google-sign-in';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#f0ede8] hover:bg-white disabled:opacity-50
                 text-[#0a0a0a] font-body text-[11px] tracking-[0.25em] uppercase
                 py-4 rounded-xl transition-colors"
    >
      {pending ? 'Signing in...' : 'Sign In'}
    </button>
  );
}

function PasswordField() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        name="password"
        required
        placeholder="Password"
        className="w-full bg-[#0d0d0d] border border-[#1e1e1e] focus:border-[#677db7]
                   rounded-xl px-4 py-3.5 pr-12 font-body text-sm text-[#f0ede8]
                   outline-none transition-colors placeholder:text-[#2a2a2a]"
      />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#677db7] transition-colors"
      >
        {visible ? <EyeSlash size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

const NAV = [
  { label: 'About',     href: '/about' },
  { label: 'Community', href: '/community' },
  { label: 'Contact',   href: '/contact' },
];

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
        className={`fixed inset-0 z-40 bg-black/75 backdrop-blur-sm transition-opacity duration-300
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Floating panel */}
      <div
        className={`fixed top-4 right-4 bottom-4 z-50
                    w-[calc(100%-2rem)] sm:w-[820px]
                    bg-[#080808] border border-[#1a1a1a] rounded-2xl overflow-hidden
                    shadow-[0_32px_80px_rgba(0,0,0,0.8)]
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)]'}`}
      >
        <div className="grid h-full grid-cols-1 sm:grid-cols-[260px_1fr]">

          {/* ── Left: branding ── */}
          <div className="hidden sm:flex flex-col bg-[#050505] border-r border-[#111] p-9">
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-sm bg-[#677db7]" />
              <span className="font-display text-[11px] tracking-[0.2em] text-[#f0ede8]">
                NNAMDI OBI
              </span>
            </div>

            <div className="flex-1" />

            <p className="font-body text-[11px] leading-[1.9] text-[#333] mb-10 max-w-[190px]">
              Access the community. Read essays, follow projects, and stay close to the work.
            </p>

            <div className="flex flex-col gap-3">
              {NAV.map(({ label, href }) => (
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

          {/* ── Right: form ── */}
          <div className="flex flex-col px-10 py-9 overflow-y-auto">

            {/* Top bar */}
            <div className="flex items-center justify-between mb-10">
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
            <h2 className="font-display text-[40px] leading-tight tracking-tight text-[#f0ede8] mb-1">
              Sign in.
            </h2>
            <p className="font-body text-[11px] text-[#444] tracking-wide mb-8">
              Access your account to continue.
            </p>

            {/* Google */}
            <GoogleSignInButton />

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#161616]" />
              <span className="font-body text-[10px] tracking-[0.2em] text-[#333]">or</span>
              <div className="flex-1 h-px bg-[#161616]" />
            </div>

            {/* Email + password form */}
            <form action={login} className="flex flex-col gap-3">
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Email address"
                className="w-full bg-[#0d0d0d] border border-[#1e1e1e] focus:border-[#677db7]
                           rounded-xl px-4 py-3.5 font-body text-sm text-[#f0ede8]
                           outline-none transition-colors placeholder:text-[#2a2a2a]"
              />

              <PasswordField />

              <div className="flex justify-end -mt-1">
                <Link
                  href="/forgot-password"
                  className="font-body text-[9px] tracking-[0.15em] text-[#333] hover:text-[#677db7] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="mt-2">
                <SubmitButton />
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-[#111] flex items-center justify-between">
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
