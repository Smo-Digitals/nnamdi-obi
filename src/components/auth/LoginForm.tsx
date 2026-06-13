'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeSlash } from 'phosphor-react';
import { useFormStatus } from 'react-dom';
import { login, loginWithGoogle } from '@/app/(auth)/actions';

function SignInButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-[10px] bg-[#DC5B17] hover:bg-[#c44f13] group-data-[theme=light]:bg-black group-data-[theme=light]:hover:bg-[#222] text-white text-sm font-semibold transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {pending ? 'Signing in…' : 'Sign In →'}
    </button>
  );
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const params = useSearchParams();
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
        <span className="text-[#666] group-data-[theme=light]:text-[#a0a0a0] text-xs">Or sign in with</span>
        <div className="flex-1 h-px bg-[#2a2a2a] group-data-[theme=light]:bg-[#e8e8e8]" />
      </div>

      <form action={login} className="flex flex-col gap-3">
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
        </div>

        <SignInButton />
      </form>

      <a
        href="#"
        className="text-center text-sm text-[#DC5B17] hover:underline underline-offset-2"
      >
        Forgot password?
      </a>
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
