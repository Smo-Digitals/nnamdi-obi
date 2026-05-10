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

const BASE   = 36;
const MAX    = 52;
const GAP    = 6;
const SPREAD = 80;

export function Dock() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    setMouseX(e.clientX - ref.current.getBoundingClientRect().left);
  };

  const itemSize = (index: number) => {
    if (mouseX === null) return BASE;
    const center = index * (BASE + GAP) + BASE / 2;
    const t = Math.max(0, 1 - Math.abs(mouseX - center) / SPREAD);
    return BASE + (MAX - BASE) * t;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouseX(null)}
      className="flex flex-row items-center gap-1.5 bg-[#0e0e0e] border border-[#1c1c1c] rounded-2xl px-2 py-1.5"
    >
      {ITEMS.map(({ Icon, label, href }, i) => {
        const s = itemSize(i);
        return (
          <Link
            key={label}
            href={href}
            title={label}
            style={{
              width: s,
              height: s,
              transition: 'width 0.15s ease, height 0.15s ease',
            }}
            className="flex items-center justify-center rounded-xl text-[#3a3a3a] hover:text-[#f0ede8] hover:bg-[#1a1a1a] transition-colors duration-150"
          >
            <Icon size={Math.round(s * 0.44)} weight="light" />
          </Link>
        );
      })}
    </div>
  );
}
