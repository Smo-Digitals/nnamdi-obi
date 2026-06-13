'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PageLoaderProps {
  onComplete?: () => void;
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obj = { value: 0 };

    const tl = gsap.timeline();

    tl.to(obj, {
      value: 100,
      duration: 2.4,
      ease: 'power2.inOut',
      onUpdate() {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(obj.value).toString();
        }
      },
    }).to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete() {
        onComplete?.();
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-end justify-end bg-[#0a0a0a] p-10"
    >
      <span
        ref={counterRef}
        className="font-[family-name:var(--font-dm-mono)] text-[#f0ede8] text-[clamp(6rem,20vw,16rem)] font-light leading-none select-none"
      >
        0
      </span>
    </div>
  );
}
