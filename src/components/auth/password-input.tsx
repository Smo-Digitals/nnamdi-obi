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
        className="w-full bg-transparent border-b border-[#222] focus:border-[#677db7]
                   py-3 pr-8 font-body text-[13px] text-[#f0ede8]
                   outline-none transition-colors placeholder:text-[#2a2a2a] rounded-none"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[#333] hover:text-[#677db7] transition-colors"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeSlash size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
