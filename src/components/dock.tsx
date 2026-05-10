'use client';

import { useRef, useState } from 'react';
import { House, PenNib, User, Envelope } from 'phosphor-react';
import Link from 'next/link';

const ITEMS = [
  { Icon: House,    label: 'Home',    href: '/' },
  { Icon: PenNib,   label: 'Writing', href: '/writing' },
  { Icon: User,     label: 'About',   href: '/about' },
  { Icon: Envelope, label: 'Contact', href: '/contact' },
];

const SIZE   = 34;
const PAD    = 8;  // px-2 = 8px each side
const GAP    = 6;  // gap-1.5 = 6px
const MAX_SCALE = 1.8;
const SPREAD = 80;
const ICON   = Math.round(SIZE * 0.46);

export function Dock() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    setMouseX(e.clientX - ref.current.getBoundingClientRect().left);
  };

  const getScale = (index: number): number => {
    if (mouseX === null) return 1;
    // account for left padding when computing item center
    const center = PAD + index * (SIZE + GAP) + SIZE / 2;
    const t = Math.max(0, 1 - Math.abs(mouseX - center) / SPREAD);
    return 1 + (MAX_SCALE - 1) * t;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouseX(null)}
      className="flex flex-row items-end gap-1.5 bg-[#0e0e0e] border border-[#1c1c1c] rounded-2xl px-2 py-2"
    >
      {ITEMS.map(({ Icon, label, href }, i) => {
        const s = getScale(i);
        return (
          <Link
            key={label}
            href={href}
            title={label}
            style={{
              width: SIZE,
              height: SIZE,
              transform: `scale(${s.toFixed(3)})`,
              transformOrigin: 'bottom center',
              willChange: 'transform',
            }}
            className="flex items-center justify-center rounded-xl text-[#3a3a3a] hover:text-[#f0ede8] hover:bg-[#1a1a1a]"
          >
            <Icon size={ICON} weight="light" />
          </Link>
        );
      })}
    </div>
  );
}
