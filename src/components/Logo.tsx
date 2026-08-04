import Image from 'next/image';

export function Logo({ height = 26 }: { height?: number }) {
  const width = Math.round(height * (2467 / 494));
  return (
    <Image
      src="/logo-lockup.svg"
      alt="Nnamdi Obi"
      width={width}
      height={height}
      priority
    />
  );
}

export function LogoMark({ size = 20 }: { size?: number }) {
  return (
    <Image
      src="/logo-mark.svg"
      alt="Nnamdi Obi"
      width={size}
      height={size}
    />
  );
}
