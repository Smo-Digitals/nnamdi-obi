import Image from 'next/image';
import { SpotlightCard } from './spotlight-card';

export function HomeLeft() {
  return (
    <SpotlightCard
      className="min-h-[50vh] sm:min-h-[60vh] lg:min-h-screen lg:sticky lg:top-0"
      spotlightColor="rgba(255, 210, 160, 0.15)"
    >
      <Image
        src="/nnamdi1.png"
        alt="Nnamdi Obi"
        fill
        priority
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />

      <p className="absolute top-6 left-6 sm:top-8 sm:left-8 font-display text-xl sm:text-2xl tracking-[0.2em] text-white z-30 font-semibold">
        NNAMDI OBI
      </p>

      <p className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 font-body text-[11px] leading-6 text-white/60 max-w-[240px] z-30">
        Nigerian entrepreneur. I build companies, help others solve hard
        problems, and write about Africa&apos;s infrastructure of the future.
      </p>
    </SpotlightCard>
  );
}
