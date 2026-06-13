import { Suspense } from 'react';
import Image from 'next/image';
import { AdminLoginForm } from '@/components/auth/AdminLoginForm';
import { AuthAnimate } from '@/components/auth/AuthAnimate';
import { AuthRightPanel } from '@/components/auth/AuthRightPanel';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#0a0a0a] p-2">
        <div className="relative flex-1 rounded-2xl overflow-hidden">
          <Image
            src="/nnamdi.jpg"
            alt="Nnamdi Obi"
            fill
            className="object-cover object-[50%_20%] scale-x-[-1]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute bottom-10 left-8 right-8">
            <h2 className="text-white font-bold text-3xl leading-snug mb-2">
              Admin Portal
            </h2>
            <p className="text-white/55 text-base leading-relaxed max-w-sm">
              Manage your community, courses, and members from one place.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <AuthRightPanel>
        <AuthAnimate>
          <header className="flex items-center justify-between px-10 py-6">
            <div className="w-8 h-8" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DC5B17]/10 border border-[#DC5B17]/20">
              <span className="w-2 h-2 rounded-full bg-[#DC5B17] animate-pulse" />
              <span className="text-[#DC5B17] text-xs font-semibold">Admin access only</span>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center px-8 py-12">
            <div className="w-full max-w-[400px]">
              <div className="mb-8">
                <h1 className="text-white group-data-[theme=light]:text-[#1a1a1a] text-2xl font-bold mb-1.5">
                  Welcome back, Nnamdi
                </h1>
                <p className="text-[#888] group-data-[theme=light]:text-[#8a8a8a] text-sm">
                  Sign in to your admin dashboard.
                </p>
              </div>

              <Suspense>
                <AdminLoginForm />
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
      </AuthRightPanel>
    </div>
  );
}
