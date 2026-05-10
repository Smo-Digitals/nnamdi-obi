import Link from 'next/link';
import { signup } from '../actions';

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignupPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="w-full max-w-[360px]">
      <h1 className="font-display text-6xl tracking-[0.1em] text-[#f0ede8] mb-1">
        JOIN
      </h1>
      <p className="font-body text-[10px] tracking-[0.3em] text-[#444] mb-10">
        CREATE YOUR ACCOUNT
      </p>

      {error && (
        <div className="border border-red-900/50 bg-red-950/20 px-4 py-3 mb-6">
          <p className="font-body text-xs text-red-400">{decodeURIComponent(error)}</p>
        </div>
      )}

      <form action={signup} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="font-body text-[10px] tracking-[0.25em] uppercase text-[#444]">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            required
            placeholder="Your full name"
            className="bg-transparent border border-[#1c1c1c] focus:border-[#677db7] px-4 py-3 font-body text-sm text-[#f0ede8] outline-none transition-colors placeholder:text-[#2a2a2a]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-body text-[10px] tracking-[0.25em] uppercase text-[#444]">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="bg-transparent border border-[#1c1c1c] focus:border-[#677db7] px-4 py-3 font-body text-sm text-[#f0ede8] outline-none transition-colors placeholder:text-[#2a2a2a]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-body text-[10px] tracking-[0.25em] uppercase text-[#444]">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            placeholder="Minimum 8 characters"
            className="bg-transparent border border-[#1c1c1c] focus:border-[#677db7] px-4 py-3 font-body text-sm text-[#f0ede8] outline-none transition-colors placeholder:text-[#2a2a2a]"
          />
        </div>

        <button
          type="submit"
          className="mt-2 bg-[#677db7] hover:bg-[#5a6da0] text-[#f0ede8] font-body text-[11px] tracking-[0.25em] uppercase py-3 transition-colors"
        >
          Create Account
        </button>
      </form>

      <p className="font-body text-[10px] text-[#444] tracking-wider mt-8">
        Already have an account?{' '}
        <Link href="/login" className="text-[#677db7] hover:text-[#f0ede8] transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
