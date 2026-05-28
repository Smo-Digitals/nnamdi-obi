'use client';

import { useFormStatus } from 'react-dom';
import { ArrowRight } from '@/components/icons';

interface Props {
  label: string;
  pendingLabel: string;
}

export function SubmitButton({ label, pendingLabel }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 flex items-center justify-between bg-[#677db7] hover:bg-[#5a6da0] disabled:opacity-60 disabled:cursor-not-allowed text-[#f0ede8] font-body text-[11px] tracking-[0.3em] uppercase px-5 py-3.5 w-full transition-colors group"
    >
      <span>{pending ? pendingLabel : label}</span>
      <ArrowRight
        size={14}
        className="group-hover:translate-x-1 transition-transform"
        weight="bold"
      />
    </button>
  );
}
