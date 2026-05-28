import Link from 'next/link';
import { login } from '../actions';
import { SubmitButton } from '@/components/auth/submit-button';
import { PasswordInput } from '@/components/auth/password-input';

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="w-full max-w-[400px]">

      {/* Index marker */}
      <div className="flex items-center gap-4 mb-10">
        <span className="font-body text-[10px] tracking-[0.4em] text-[#677db7]">[ AUTH ]</span>
        <div className="flex-1 h-px bg-[#1c1c1c]" />
        <span className="font-body text-[9px] tracking-[0.3em] text-[#2a2a2a]">01 / SIGN IN</span>
      </div>

      {/* Heading */}
      <h1 className="font-display text-[56px] leading-[0.9] tracking-tight text-[#f0ede8] mb-2">
        SIGN IN
      </h1>
      <p className="font-body text-[10px] tracking-[0.35em] text-[#333] mb-10">
        ACCESS YOUR ACCOUNT
      </p>

      {/* Error */}
      {error && (
        <div className="border-l-2 border-red-700 bg-red-950/20 px-4 py-3 mb-6">
          <p className="font-body text-xs text-red-400 tracking-wider">
            {decodeURIComponent(error)}
          </p>
        </div>
      )}

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
          <div className="flex items-center justify-between">
            <label className="font-body text-[9px] tracking-[0.35em] uppercase text-[#444]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="font-body text-[9px] tracking-[0.2em] text-[#333] hover:text-[#677db7] transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <PasswordInput name="password" />
        </div>

        <SubmitButton label="Sign In" pendingLabel="Signing in..." />
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#1c1c1c] flex items-center justify-between">
        <p className="font-body text-[9px] text-[#333] tracking-[0.2em]">
          No account yet?
        </p>
        <Link
          href="/signup"
          className="font-body text-[9px] tracking-[0.25em] uppercase text-[#677db7] hover:text-[#f0ede8] transition-colors"
        >
          Create one →
        </Link>
      </div>

    </div>
  );
}
