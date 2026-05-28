'use client';

import { useState } from 'react';
import { Dock } from './dock';
import { AuthDrawer } from './auth/auth-drawer';

export function HomeTopBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <Dock />
        <button
          onClick={() => setOpen(true)}
          className="font-body text-[9px] tracking-[0.3em] uppercase text-[#444] hover:text-[#677db7] border border-[#1c1c1c] hover:border-[#677db7] px-4 py-2 transition-colors"
        >
          Login
        </button>
      </div>

      <AuthDrawer isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
