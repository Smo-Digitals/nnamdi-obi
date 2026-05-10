import Link from 'next/link';
import { ArrowRight } from 'phosphor-react';

const COMPANIES = ['MANAA', 'PRATAA', 'CRAFTLY', 'SMO DIGITALS'];

export function Hero() {
  return (
    <section className="min-h-[calc(100vh-56px)] flex flex-col justify-between py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col gap-16">

        {/* Index marker */}
        <div className="flex items-center gap-4">
          <span className="font-body text-[10px] tracking-[0.4em] text-[#677db7]">
            [ 01 ]
          </span>
          <div className="flex-1 h-px bg-[#1c1c1c]" />
          <span className="font-body text-[10px] tracking-[0.3em] text-[#2a2a2a]">
            LAGOS · NIGERIA · 2026
          </span>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-20 items-end">

          {/* Headline */}
          <div>
            <h1
              className="font-display leading-[0.9] tracking-tight text-[#f0ede8]"
              style={{ fontSize: 'clamp(72px, 13vw, 196px)' }}
            >
              BUILDING
              <br />
              AFRICA&apos;S
              <br />
              <span className="text-[#677db7]">FUTURE.</span>
            </h1>
          </div>

          {/* Right descriptor */}
          <div className="lg:pb-3 flex flex-col gap-8">
            <p className="font-body text-sm leading-7 text-[#555]">
              Nigerian entrepreneur. Founder of Manaa, Prataa, Craftly, and SMO
              Digitals. Writing on African geopolitics and sovereignty. Building
              toward an African DARPA equivalent.
            </p>

            <div className="flex flex-col gap-4">
              <Link
                href="/writing"
                className="flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-[#f0ede8] hover:text-[#677db7] transition-colors group w-fit"
              >
                Read my writing
                <ArrowRight
                  size={13}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/portfolio"
                className="flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-[#444] hover:text-[#f0ede8] transition-colors group w-fit"
              >
                See my work
                <ArrowRight
                  size={13}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Companies strip */}
        <div className="border-t border-[#1c1c1c] pt-6 flex flex-wrap items-center gap-x-10 gap-y-3">
          <span className="font-body text-[9px] tracking-[0.3em] text-[#2a2a2a] uppercase">
            Founded:
          </span>
          {COMPANIES.map((c) => (
            <span
              key={c}
              className="font-body text-[10px] tracking-[0.25em] text-[#333] hover:text-[#677db7] transition-colors cursor-default"
            >
              {c}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}
