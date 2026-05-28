'use client';

import { useState } from 'react';
import { Dock } from './dock';
import { AuthDrawer } from './auth/auth-drawer';
import { LoginButton } from './auth/login-button';

export function HomeTopBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <Dock />
        <LoginButton onClick={() => setOpen(true)} />
      </div>

      <AuthDrawer isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
