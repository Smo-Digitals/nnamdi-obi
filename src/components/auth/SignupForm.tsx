'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeSlash, Check } from 'phosphor-react';
import { useFormStatus } from 'react-dom';
import { signup, loginWithGoogle } from '@/app/(auth)/actions';

function SubmitButton({ allRulesMet }: { allRulesMet: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={!allRulesMet || pending}
      className="w-full py-3 rounded-[10px] bg-[#DC5B17] hover:bg-[#c44f13] group-data-[theme=light]:bg-black group-data-[theme=light]:hover:bg-[#222] text-white text-sm font-semibold transition-colors mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {pending ? 'Creating account…' : 'Create account →'}
    </button>
  );
}

const rules = [
  { id: 'length',  label: 'At least 8 characters',       test: (p: string) => p.length >= 8 },
  { id: 'upper',   label: 'One uppercase letter (A–Z)',   test: (p: string) => /[A-Z]/.test(p) },
  { id: 'number',  label: 'One number (0–9)',             test: (p: string) => /[0-9]/.test(p) },
  { id: 'special', label: 'One special character (!@#$)', test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

function getStrength(password: string) {
  const score = rules.filter((r) => r.test(password)).length;
  if (score <= 1) return { label: 'Weak',   color: '#ef4444', bars: 1 };
  if (score <= 2) return { label: 'Fair',   color: '#f97316', bars: 2 };
  if (score <= 3) return { label: 'Good',   color: '#eab308', bars: 3 };
  return           { label: 'Strong', color: '#22c55e', bars: 4 };
}

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const params = useSearchParams();
  const strength = getStrength(password);
  const allRulesMet = rules.every((r) => r.test(password));
  const error = params.get('error');

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="text-sm text-red-400 group-data-[theme=light]:text-red-500 bg-red-900/20 group-data-[theme=light]:bg-red-50 border border-red-800/30 group-data-[theme=light]:border-red-100 rounded-[10px] px-4 py-3">
          {error}
        </p>
      )}

      <form action={loginWithGoogle}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[10px] border border-[#2a2a2a] group-data-[theme=light]:border-[#e4e4e4] text-white group-data-[theme=light]:text-[#1a1a1a] text-sm font-medium hover:bg-[#1a1a1a] group-data-[theme=light]:hover:bg-[#f8f8f8] transition-colors"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#2a2a2a] group-data-[theme=light]:bg-[#e8e8e8]" />
        <span className="text-[#666] group-data-[theme=light]:text-[#a0a0a0] text-xs">Or sign up with email</span>
        <div className="flex-1 h-px bg-[#2a2a2a] group-data-[theme=light]:bg-[#e8e8e8]" />
      </div>

      <form action={signup} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="full_name" className="text-xs font-medium text-[#aaa] group-data-[theme=light]:text-[#3a3a3a]">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            placeholder="Your name"
            required
            className="w-full px-4 py-3 rounded-[10px] border bg-[#1a1a1a] group-data-[theme=light]:bg-white border-[#2a2a2a] group-data-[theme=light]:border-[#e4e4e4] text-white group-data-[theme=light]:text-[#1a1a1a] text-sm placeholder:text-[#555] group-data-[theme=light]:placeholder:text-[#c0c0c0] outline-none focus:border-[#DC5B17] focus:ring-2 focus:ring-[#DC5B17]/20 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium text-[#aaa] group-data-[theme=light]:text-[#3a3a3a]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 rounded-[10px] border bg-[#1a1a1a] group-data-[theme=light]:bg-white border-[#2a2a2a] group-data-[theme=light]:border-[#e4e4e4] text-white group-data-[theme=light]:text-[#1a1a1a] text-sm placeholder:text-[#555] group-data-[theme=light]:placeholder:text-[#c0c0c0] outline-none focus:border-[#DC5B17] focus:ring-2 focus:ring-[#DC5B17]/20 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-medium text-[#aaa] group-data-[theme=light]:text-[#3a3a3a]">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="minimum 8 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-[10px] border bg-[#1a1a1a] group-data-[theme=light]:bg-white border-[#2a2a2a] group-data-[theme=light]:border-[#e4e4e4] text-white group-data-[theme=light]:text-[#1a1a1a] text-sm placeholder:text-[#555] group-data-[theme=light]:placeholder:text-[#c0c0c0] outline-none focus:border-[#DC5B17] focus:ring-2 focus:ring-[#DC5B17]/20 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-white group-data-[theme=light]:hover:text-[#3a3a3a] transition-colors"
            >
              {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Strength bar — only when typing */}
          {password.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    style={bar <= strength.bars ? { backgroundColor: strength.color } : undefined}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${bar <= strength.bars ? '' : 'bg-white/10 group-data-[theme=light]:bg-black/10'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold w-12 text-right" style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
          )}

          {/* Rules — only show when typing */}
          {password.length > 0 && <div className="flex flex-col gap-1.5 mt-1">
            {rules.map((rule) => {
              const passed = rule.test(password);
              return (
                <div key={rule.id} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${passed ? 'bg-green-500' : 'bg-white/10 group-data-[theme=light]:bg-black/10'}`}>
                    {passed && <Check size={9} weight="bold" color="white" />}
                  </div>
                  <span className={`text-xs transition-colors duration-200 ${passed ? 'text-green-400' : 'text-white/40 group-data-[theme=light]:text-black/40'}`}>
                    {rule.label}
                  </span>
                </div>
              );
            })}
          </div>}
        </div>

        <SubmitButton allRulesMet={allRulesMet} />
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}
