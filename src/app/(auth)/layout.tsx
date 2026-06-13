import Image from 'next/image';
import { ReactNode } from 'react';
import { AuthRightPanel } from '@/components/auth/AuthRightPanel';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — padded container */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#0a0a0a] p-2">
        {/* Inner full-bleed card with rounded corners */}
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
              Teacher, Builder &amp; Founder
            </h2>
            <p className="text-white/55 text-base leading-relaxed max-w-sm">
              Building the infrastructure of Africa&apos;s future, one community at a time.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <AuthRightPanel>
        {children}
      </AuthRightPanel>
    </div>
  );
}
