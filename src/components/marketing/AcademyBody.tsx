'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen } from 'phosphor-react';
import { SiteHeader } from '@/components/SiteHeader';

const tracks = [
  { title: 'Business Growth Masterclass', tag: 'Business',  color: '#DC5B17' },
  { title: 'Tech Foundations',            tag: 'Tech',       color: '#22c55e' },
  { title: 'Leadership 101',              tag: 'Leadership', color: '#eab308' },
];

export function AcademyBody() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6 pt-36 pb-24">
        <p className="text-[#DC5B17] text-sm font-semibold mb-3">Academy</p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6 max-w-2xl">
          Structured courses built from real experience.
        </h1>
        <p className="text-[#666] text-lg leading-relaxed max-w-2xl mb-14">
          Every track in the Academy comes with lessons, live feedback, and a community of people learning the same thing at the same time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
          {tracks.map(({ title, tag, color }) => (
            <div key={title} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
              <div className="h-36 flex items-center justify-center" style={{ background: `${color}15` }}>
                <BookOpen size={40} style={{ color }} weight="duotone" />
              </div>
              <div className="p-5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3 inline-block" style={{ background: `${color}20`, color }}>{tag}</span>
                <h3 className="text-white font-semibold text-sm">{title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to start learning?</h2>
          <p className="text-[#666] mb-6">Log in to pick up where you left off, or join to enroll.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#DC5B17] text-white font-semibold hover:bg-[#c44f13] transition-colors">
            Log in to Academy <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
