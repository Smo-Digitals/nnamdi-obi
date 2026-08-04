'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'phosphor-react';
import { SiteHeader } from '@/components/SiteHeader';

export function AboutBody() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SiteHeader />

      <main className="max-w-4xl mx-auto px-6 pt-36 pb-24">
        <p className="text-[#DC5B17] text-sm font-semibold mb-3">About</p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
          Teaching what actually works, not theory.
        </h1>
        <p className="text-[#666] text-lg leading-relaxed max-w-2xl mb-12">
          Nnamdi Obi builds tools, courses, and a community for entrepreneurs and builders across Africa who want to learn by doing rather than by sitting through another lecture.
        </p>

        <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden mb-12 bg-[#111]">
          <Image src="/nnamdi.jpg" alt="Nnamdi Obi" fill className="object-cover object-[50%_20%]" priority />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-xl font-semibold mb-3">The mission</h2>
            <p className="text-[#666] leading-relaxed">
              To give African builders direct, practical access to the skills and network they need — without gatekeeping and without the fluff most courses are padded with.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">How we teach</h2>
            <p className="text-[#666] leading-relaxed">
              Real case studies, live feedback, and a community that holds each other accountable. Every course comes from something Nnamdi actually built or shipped.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Want to be part of it?</h2>
          <p className="text-[#666] mb-6">Join the community and get access to the Academy.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#DC5B17] text-white font-semibold hover:bg-[#c44f13] transition-colors">
            Get started <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
