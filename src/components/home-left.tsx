import Image from 'next/image';
import { SpotlightCard } from './spotlight-card';

export function HomeLeft() {
  return (
    <SpotlightCard
      className="min-h-[60vh] lg:min-h-screen lg:sticky lg:top-0"
      spotlightColor="rgba(255, 210, 160, 0.15)"
    >
      <Image
        src="/nnamdi1.png"
        alt="Nnamdi Obi"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Bottom gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />

      {/* Name top-left */}
      <p className="absolute top-8 left-8 font-display text-2xl tracking-[0.2em] text-white z-30 font-semibold">
        NNAMDI OBI
      </p>

      {/* Bio bottom-left */}
      <p className="absolute bottom-8 left-8 right-8 font-body text-[11px] leading-6 text-white/60 max-w-[240px] z-30">
        Nigerian entrepreneur. I build companies, help others solve hard
        problems, and write about Africa&apos;s infrastructure of the future.
      </p>
    </SpotlightCard>
  );
}
