import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { VerifyForm } from '@/components/auth/VerifyForm';
import { AuthAnimate } from '@/components/auth/AuthAnimate';

interface VerifyPageProps {
  searchParams: Promise<{ email?: string; error?: string; resent?: string }>;
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { email, error, resent } = await searchParams;

  if (!email) redirect('/signup');

  return (
    <AuthAnimate>
      <header className="flex items-center justify-between px-10 py-6">
        <div className="w-8 h-8" />
      </header>

      <main className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 text-center">
            <h1 className="text-white group-data-[theme=light]:text-[#1a1a1a] text-2xl font-bold mb-1.5">
              Check your email
            </h1>
            <p className="text-[#888] group-data-[theme=light]:text-[#8a8a8a] text-sm">
              We sent a 6-digit code to{' '}
              <span className="text-white group-data-[theme=light]:text-[#1a1a1a] font-medium">
                {email}
              </span>
            </p>
          </div>

          <Suspense>
            <VerifyForm email={email} error={error} resent={resent === 'true'} />
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
