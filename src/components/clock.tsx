'use client';

import { useEffect, useState } from 'react';

const SEGMENTS = 12;
const ORANGE = '#E8642A';
const ORANGE_DIM = 'rgba(232, 100, 42, 0.4)';
const SEGMENT_OFF = '#252525';

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

  const litSegments = Math.floor((now.getSeconds() / 60) * SEGMENTS);

  return (
    <div className="flex flex-col items-end gap-2 select-none">
      <span
        className="font-body text-[10px] tracking-[0.2em]"
        style={{ color: ORANGE_DIM }}
      >
        {date}
      </span>
      <span
        className="font-display text-xl font-bold tracking-tight leading-none tabular-nums"
        style={{ color: ORANGE }}
      >
        {time}
      </span>
      <div className="flex items-center gap-[4px] pt-1">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 4,
              borderRadius: 2,
              backgroundColor: i < litSegments ? ORANGE : SEGMENT_OFF,
              transition: 'background-color 0.4s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
