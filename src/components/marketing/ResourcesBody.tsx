'use client';

import Link from 'next/link';
import { ArrowRight, NotePencil, FileText, DownloadSimple } from 'phosphor-react';
import { SiteHeader } from '@/components/SiteHeader';

const resources = [
  { icon: NotePencil,      title: 'Blog',      desc: 'Writing on building in public, entrepreneurship, and tech.', href: '/blog' },
  { icon: FileText,        title: 'Guides',    desc: 'In-depth breakdowns of how to get started in business and tech.', href: '/blog' },
  { icon: DownloadSimple,  title: 'Templates', desc: 'Ready-to-use templates for planning, pitching, and shipping.', href: '/blog' },
];

export function ResourcesBody() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6 pt-36 pb-24">
        <p className="text-[#DC5B17] text-sm font-semibold mb-3">Resources</p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6 max-w-2xl">
          Free writing, guides, and tools to help you build.
        </h1>
        <p className="text-[#666] text-lg leading-relaxed max-w-2xl mb-14">
          Everything here is free to read. No login required until you want to go deeper in the Academy.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
          {resources.map(({ icon: Icon, title, desc, href }) => (
            <Link key={title} href={href} className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-[#DC5B17]/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#DC5B17]/10 flex items-center justify-center mb-4">
                <Icon size={20} weight="duotone" className="text-[#DC5B17]" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-[#555] text-sm leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111] px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Want more, direct from Nnamdi?</h2>
          <p className="text-[#666] mb-6">Join the community for deeper courses and live access.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#DC5B17] text-white font-semibold hover:bg-[#c44f13] transition-colors">
            Log in <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
