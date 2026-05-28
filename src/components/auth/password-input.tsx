'use client';

import { useState } from 'react';
import { Eye, EyeSlash } from '@/components/icons';

interface Props {
  name: string;
  placeholder?: string;
  minLength?: number;
}

export function PasswordInput({ name, placeholder = '••••••••', minLength }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        name={name}
        required
        minLength={minLength}
        placeholder={placeholder}
        className="w-full bg-transparent border border-[#1c1c1c] focus:border-[#677db7] px-4 py-3 pr-11 font-body text-sm text-[#f0ede8] outline-none transition-colors placeholder:text-[#2a2a2a]"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#677db7] transition-colors"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeSlash size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
