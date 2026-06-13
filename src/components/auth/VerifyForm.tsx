'use client';

import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyOtp, resendOtp } from '@/app/(auth)/actions';

interface VerifyFormProps {
  email: string;
  error?: string;
  resent?: boolean;
}

// Rounded-rectangle path for 48×56 box with r=10
const BOX_PATH = 'M10,1.5 L38,1.5 A8.5,8.5 0 0 1 46.5,10 L46.5,46 A8.5,8.5 0 0 1 38,54.5 L10,54.5 A8.5,8.5 0 0 1 1.5,46 L1.5,10 A8.5,8.5 0 0 1 10,1.5 Z';

export function VerifyForm({ email, error, resent }: VerifyFormProps) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const token = digits.join('');
  const isComplete = token.length === 6;

  // Auto-submit after animation plays
  useEffect(() => {
    if (!isComplete) return;
    const timer = setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 900);
    return () => clearTimeout(timer);
  }, [isComplete]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...digits];
    pasted.split('').forEach((char, i) => { next[i] = char; });
    setDigits(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex flex-col gap-6">
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-red-400 group-data-[theme=light]:text-red-500 bg-red-900/20 group-data-[theme=light]:bg-red-50 border border-red-800/30 group-data-[theme=light]:border-red-100 rounded-[10px] px-4 py-3 text-center"
          >
            {error}
          </motion.p>
        )}
        {resent && (
          <motion.p
            key="resent"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-green-400 group-data-[theme=light]:text-green-600 bg-green-900/20 group-data-[theme=light]:bg-green-50 border border-green-800/30 group-data-[theme=light]:border-green-100 rounded-[10px] px-4 py-3 text-center"
          >
            New code sent — check your inbox.
          </motion.p>
        )}
      </AnimatePresence>

      <form ref={formRef} action={verifyOtp} className="flex flex-col gap-6">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="token" value={token} />

        <div className="flex gap-3 justify-center">
          {digits.map((digit, i) => {
            const isFocused = focusedIndex === i;
            const hasDigit = digit !== '';
            const isActive = isFocused || hasDigit;

            return (
              <motion.div
                key={i}
                className="relative w-12 h-14"
                animate={isComplete ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, delay: i * 0.055, ease: 'easeOut' }}
              >
                <input
                  ref={(el) => { inputs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  onFocus={() => setFocusedIndex(i)}
                  onBlur={() => setFocusedIndex(null)}
                  className={`w-full h-full text-center text-xl font-semibold rounded-[10px] border bg-[#1a1a1a] group-data-[theme=light]:bg-white text-white group-data-[theme=light]:text-[#1a1a1a] outline-none transition-all duration-200
                    ${isActive || isComplete
                      ? 'border-[#DC5B17] shadow-[0_0_0_3px_rgba(220,91,23,0.18)]'
                      : 'border-[#2a2a2a] group-data-[theme=light]:border-[#e4e4e4]'
                    }`}
                />

                {/* Circular trace on complete */}
                <AnimatePresence>
                  {isComplete && (
                    <motion.svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox="0 0 48 56"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.path
                        d={BOX_PATH}
                        fill="none"
                        stroke="#DC5B17"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.55, delay: i * 0.07, ease: 'easeInOut' }}
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>

                {/* Ripple on complete */}
                <AnimatePresence>
                  {isComplete && (
                    <motion.div
                      className="absolute inset-0 rounded-[10px] border border-[#DC5B17] pointer-events-none"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 1.25, opacity: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.07 + 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Status text */}
        <p className="text-center text-xs text-[#555] group-data-[theme=light]:text-[#aaa]">
          {isComplete ? 'Verifying…' : 'Enter the 6-digit code from your email'}
        </p>
      </form>

      <form action={resendOtp}>
        <input type="hidden" name="email" value={email} />
        <p className="text-center text-sm text-[#555] group-data-[theme=light]:text-[#8a8a8a]">
          Didn&apos;t get a code?{' '}
          <button
            type="submit"
            className="text-[#DC5B17] hover:underline underline-offset-2 font-medium"
          >
            Resend code
          </button>
        </p>
      </form>
    </div>
  );
}
