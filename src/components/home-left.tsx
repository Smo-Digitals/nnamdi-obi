import Image from 'next/image';

export function HomeLeft() {
  return (
    <div className="relative min-h-[60vh] lg:min-h-screen lg:sticky lg:top-0">
      <Image
        src="/nnamdi.jpg"
        alt="Nnamdi Obi"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Subtle bottom gradient so text is readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Name top-left */}
      <p className="absolute top-8 left-8 font-display text-2xl tracking-[0.2em] text-white z-10">
        NNAMDI OBI
      </p>

      {/* Bio bottom-left */}
      <p className="absolute bottom-8 left-8 right-8 font-body text-[11px] leading-6 text-white/60 max-w-[240px] z-10">
        Nigerian entrepreneur. I build companies, help others solve hard
        problems, and write about Africa&apos;s infrastructure of the future.
      </p>
    </div>
  );
}
