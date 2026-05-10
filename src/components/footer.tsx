import Link from 'next/link';
import { ArrowUpRight } from '@/components/icons';

const SOCIALS = [
  { href: '#', label: 'X / Twitter' },
  { href: '#', label: 'LinkedIn' },
  { href: '#', label: 'YouTube' },
  { href: '#', label: 'Substack' },
];

export function Footer() {
  return (
    <footer className="border-t border-[#1c1c1c] mt-32">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12">
          <div>
            <p className="font-display text-5xl tracking-[0.1em] text-[#f0ede8]">
              NNAMDI OBI
            </p>
            <p className="font-body text-[10px] tracking-[0.3em] text-[#333] mt-3">
              NIGERIAN ENTREPRENEUR · WRITER · BUILDER
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-body text-[10px] tracking-[0.2em] uppercase text-[#444] hover:text-[#677db7] transition-colors group"
              >
                {s.label}
                <ArrowUpRight
                  size={11}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-[#1c1c1c] flex flex-col md:flex-row justify-between gap-4">
          <p className="font-body text-[10px] text-[#2a2a2a] tracking-[0.2em]">
            © {new Date().getFullYear()} NNAMDI OBI. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <Link
              href="/login"
              className="font-body text-[10px] text-[#2a2a2a] hover:text-[#444] tracking-[0.2em] transition-colors"
            >
              ADMIN
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
