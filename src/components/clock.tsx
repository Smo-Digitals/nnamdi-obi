'use client';

import { useEffect, useState } from 'react';

export function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
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
    <div className="flex flex-col items-end gap-0.5 select-none">
      <span className="font-body text-[10px] tracking-[0.2em] text-[#555]">
        {date}
      </span>
      <span className="font-display text-3xl font-bold tracking-tight text-[#f0ede8] leading-none tabular-nums">
        {time}
      </span>
    </div>
  );
}
