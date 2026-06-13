'use client';

import { useState, ReactNode } from 'react';
import { Sun, Moon } from 'phosphor-react';

export function AuthRightPanel({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className="flex-1 bg-[#0a0a0a] p-2">
      <div
        className="group relative rounded-2xl flex flex-col h-full overflow-hidden bg-[#0f0f0f] data-[theme=light]:bg-white transition-colors duration-200"
        data-theme={isDark ? 'dark' : 'light'}
      >
        <button
          onClick={() => setIsDark(!isDark)}
          className="absolute top-6 left-10 z-10 w-8 h-8 flex items-center justify-center rounded-lg text-[#666] hover:text-white group-data-[theme=light]:hover:text-[#1a1a1a] transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {children}
      </div>
    </div>
  );
}
