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

const SIZE   = 36;
const MAX_SCALE = 1.5;
const SPREAD = 70;
const ICON   = Math.round(SIZE * 0.44);

export function Dock() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    setMouseX(e.clientX - ref.current.getBoundingClientRect().left);
  };

  const scale = (index: number) => {
    if (mouseX === null) return 1;
    const center = index * (SIZE + 6) + SIZE / 2;
    const t = Math.max(0, 1 - Math.abs(mouseX - center) / SPREAD);
    return 1 + (MAX_SCALE - 1) * t;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouseX(null)}
      className="flex flex-row items-center gap-1.5 bg-[#0e0e0e] border border-[#1c1c1c] rounded-2xl px-2 py-1.5"
    >
      {ITEMS.map(({ Icon, label, href }, i) => (
        <Link
          key={label}
          href={href}
          title={label}
          style={{
            width: SIZE,
            height: SIZE,
            transform: `scale(${scale(i)})`,
            transition: 'transform 0.15s ease',
          }}
          className="flex items-center justify-center rounded-xl text-[#3a3a3a] hover:text-[#f0ede8] hover:bg-[#1a1a1a] transition-colors duration-150"
        >
          <Icon size={ICON} weight="light" />
        </Link>
      ))}
    </div>
  );
}
