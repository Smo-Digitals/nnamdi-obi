'use client';

import { useEffect, useState } from 'react';

export function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  const date = now.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  const time = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <div className="fixed top-6 right-8 z-50 flex flex-col items-end gap-0.5 select-none">
      <span className="font-body text-[10px] tracking-[0.2em] text-[#444]">
        {date}
      </span>
      <span className="font-display text-2xl font-semibold tracking-tight text-[#f0ede8] leading-none tabular-nums">
        {time}
      </span>
    </div>
  );
}
