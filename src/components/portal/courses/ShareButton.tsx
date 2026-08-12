'use client';

import { useState } from 'react';

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button onClick={share} className="text-sm font-semibold" style={{ color: '#DC5B17' }}>
      {copied ? 'Link copied' : 'Share'}
    </button>
  );
}
