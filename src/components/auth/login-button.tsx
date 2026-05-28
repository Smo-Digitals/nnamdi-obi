'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%';
const LABEL = 'LOGIN';

interface Props {
  onClick: () => void;
}

export function LoginButton({ onClick }: Props) {
  const textRef = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    onClick(); // open drawer immediately

    const el = textRef.current;
    if (!el) return;

    // GSAP: scramble letters, resolving left-to-right over 450ms
    let tween: gsap.core.Tween;
    tween = gsap.to({}, {
      duration: 0.45,
      ease: 'none',
      onUpdate() {
        const p = tween.progress();
        el.textContent = LABEL.split('').map((char, i) =>
          i < Math.floor(p * LABEL.length)
            ? char
            : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('');
      },
      onComplete() {
        el.textContent = LABEL;
      },
    });
  };

  return (
    <motion.button
      onClick={handleClick}
      // Framer Motion: spring press
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      className="relative font-body text-[9px] tracking-[0.3em] uppercase
                 text-[#444] hover:text-[#677db7]
                 border border-[#1c1c1c] hover:border-[#677db7]
                 px-4 py-2 transition-colors duration-200
                 cursor-pointer select-none"
    >
      <span ref={textRef}>{LABEL}</span>
    </motion.button>
  );
}
