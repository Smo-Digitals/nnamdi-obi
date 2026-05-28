import Link from 'next/link';
import { HomeTopBar } from './home-top-bar';

const CONTACT_STRIP = [
  { label: 'Got something in mind?', action: 'Get in touch', href: '/contact' },
  { label: 'Stay in the loop', action: 'Join the community', href: '/community' },
  { label: "I'm on socials", action: 'Follow on X', href: '#' },
];

const GRID = [
  {
    heading: 'Companies',
    items: [
      { name: 'Manaa', tag: "'24" },
      { name: 'Prataa', tag: "'24" },
      { name: 'Craftly', tag: "'23" },
      { name: 'SMO Digitals', tag: "'22" },
    ],
  },
  {
    heading: 'Writing',
    items: [
      { name: 'African Geopolitics', tag: 'Long-form' },
      { name: 'Sovereignty', tag: 'Essay' },
      { name: 'Tech Infrastructure', tag: 'Analysis' },
      { name: 'Entrepreneurship', tag: 'Essay' },
      { name: 'African DARPA', tag: 'Vision' },
    ],
  },
  {
    heading: 'Build With Me',
    items: [
      { name: 'YouTube', tag: 'Video' },
      { name: 'Newsletter', tag: 'Writing' },
      { name: 'Community', tag: 'Hub' },
      { name: 'Consulting', tag: 'Work' },
    ],
  },
  {
    heading: 'Channels',
    items: [
      { name: 'X / Twitter', tag: 'Social' },
      { name: 'LinkedIn', tag: 'Social' },
      { name: 'YouTube', tag: 'Video' },
      { name: 'Substack', tag: 'Writing' },
    ],
  },
];

export function HomeRight() {
  return (
    <div className="bg-[#060606] flex flex-col min-h-screen p-6 sm:p-8 lg:p-10 gap-6 lg:gap-10 lg:justify-between">

        <HomeTopBar />

        {/* Spacer — desktop only so clock stays pinned to top */}
        <div className="hidden lg:block lg:flex-1" />

        {/* Contact strip */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 pb-6 sm:pb-8 border-b border-[#1c1c1c]">
          {CONTACT_STRIP.map((item) => (
            <Link key={item.href} href={item.href} className="group flex flex-col gap-0.5">
              <span className="font-body text-[10px] sm:text-[11px] text-[#888]">{item.label}</span>
              <span className="font-body text-[10px] sm:text-[11px] text-[#f0ede8] group-hover:text-[#677db7] transition-colors">
                {item.action}
              </span>
            </Link>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {GRID.map((col) => (
            <div key={col.heading} className="flex flex-col gap-2.5 sm:gap-3">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#444] mb-1">
                {col.heading}
              </p>
              {col.items.map((item) => (
                <div key={item.name} className="flex items-baseline justify-between gap-2">
                  <span className="font-body text-[11px] text-[#888] hover:text-[#f0ede8] transition-colors cursor-default">
                    {item.name}
                  </span>
                  <span className="font-body text-[10px] text-[#333] whitespace-nowrap shrink-0">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom: bio + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-[#1c1c1c]">
          <p className="font-body text-[11px] leading-6 text-[#555] max-w-xs">
            I&apos;m Nnamdi Obi. I build companies, shape ideas, and write about
            Africa&apos;s sovereignty and the infrastructure of its future.
          </p>
          <Link
            href="/contact"
            className="w-full sm:w-auto shrink-0 bg-[#677db7] hover:bg-[#5a6da0] text-[#f0ede8] font-body text-[11px] tracking-[0.15em] uppercase px-6 py-3 rounded-xl transition-colors text-center"
          >
            Work with me
          </Link>
        </div>

    </div>
  );
}
