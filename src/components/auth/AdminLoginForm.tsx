'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeSlash } from 'phosphor-react';
import { useFormStatus } from 'react-dom';
import { adminLogin } from '@/app/(auth)/actions';

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

export function AdminLoginForm() {
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

      <form action={adminLogin} className="flex flex-col gap-3">
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

      <a href="#" className="text-center text-sm text-[#DC5B17] hover:underline underline-offset-2">
        Forgot password?
      </a>
    </div>
  );
}
