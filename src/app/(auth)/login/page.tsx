import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthAnimate } from '@/components/auth/AuthAnimate';

export default function LoginPage() {
  return (
    <AuthAnimate>
      <header className="flex items-center justify-between px-10 py-6">
        <div className="w-8 h-8" />
        <p className="text-[#888] group-data-[theme=light]:text-[#6a6a6a] text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#DC5B17] font-medium hover:underline underline-offset-2">
            Sign Up
          </Link>
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1 className="text-white group-data-[theme=light]:text-[#1a1a1a] text-2xl font-bold mb-1.5">Welcome back!</h1>
            <p className="text-[#888] group-data-[theme=light]:text-[#8a8a8a] text-sm">Please enter your details to sign in.</p>
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </main>

      <footer className="flex items-center justify-between px-10 py-5 text-xs text-[#555] group-data-[theme=light]:text-[#b0b0b0]">
        <span>© 2025 Nnamdi Obi</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#aaa] group-data-[theme=light]:hover:text-[#3a3a3a] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#aaa] group-data-[theme=light]:hover:text-[#3a3a3a] transition-colors">Support</a>
        </div>
      </footer>
    </AuthAnimate>
  );
}
