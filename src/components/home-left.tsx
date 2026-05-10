export function HomeLeft() {
  return (
    <div className="relative bg-[#677db7] flex flex-col justify-between p-7 overflow-hidden min-h-[280px] lg:min-h-full">

      {/* Name */}
      <p className="font-display text-2xl tracking-[0.2em] text-[#f0ede8] relative z-10">
        NNAMDI OBI
      </p>

      {/* Large decorative letter */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-display text-white/10 leading-none"
          style={{ fontSize: 'clamp(180px, 22vw, 340px)' }}
        >
          N
        </span>
      </div>

      {/* Bottom bio */}
      <div className="relative z-10">
        <p className="font-body text-[11px] leading-6 text-[#f0ede8]/70 max-w-[220px]">
          Nigerian entrepreneur. I build companies, help others solve hard
          problems, and write about Africa&apos;s infrastructure of the future.
        </p>
      </div>
    </div>
  );
}
