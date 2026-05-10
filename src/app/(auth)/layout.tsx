import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="border-b border-[#1c1c1c] px-6 h-14 flex items-center">
        <Link
          href="/"
          className="font-display text-lg tracking-[0.15em] text-[#f0ede8] hover:text-[#677db7] transition-colors"
        >
          NNAMDI OBI
        </Link>
      </div>
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        {children}
      </main>
    </div>
  );
}
