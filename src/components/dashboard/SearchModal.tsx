'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlass, X, Gauge, ChartBar, BookOpen,
  Users, ChatCircle, Bell, Gear, User,
} from 'phosphor-react';

type Item = { label: string; description: string; href: string; icon: React.ElementType };

const ALL_ITEMS: Item[] = [
  { label: 'Dashboard',      description: 'Overview and stats',          href: '/admin',                icon: Gauge     },
  { label: 'Analytics',      description: 'Growth and engagement',       href: '/admin/analytics',      icon: ChartBar  },
  { label: 'Courses',        description: 'Manage course content',       href: '/admin/courses',        icon: BookOpen  },
  { label: 'Members',        description: 'View and manage members',     href: '/admin/members',        icon: Users     },
  { label: 'Messages',       description: 'Inbox and conversations',     href: '/admin/messages',       icon: ChatCircle},
  { label: 'Notifications',  description: 'Alerts and updates',          href: '/admin/notifications',  icon: Bell      },
  { label: 'Profile',        description: 'Update your profile',         href: '/admin/profile',        icon: User      },
  { label: 'Settings',       description: 'Configure your workspace',    href: '/admin/settings',       icon: Gear      },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: Props) {
  const [query,   setQuery]   = useState('');
  const [active,  setActive]  = useState(0);
  const inputRef              = useRef<HTMLInputElement>(null);
  const router                = useRouter();

  const results = query.trim()
    ? ALL_ITEMS.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.description.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_ITEMS;

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setActive(0); }, [query]);

  function go(href: string) {
    router.push(href);
    onClose();
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown')  { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter')      { if (results[active]) go(results[active].href); }
    if (e.key === 'Escape')     { onClose(); }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[18%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-[#111] border border-white/[0.1] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden">

              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
                <MagnifyingGlass size={16} className="text-[#555] shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Search pages, settings…"
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-[#444] outline-none"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-[#444] hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                )}
                <kbd className="text-[10px] bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded text-[#444]">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto py-1.5">
                {results.length === 0 ? (
                  <p className="text-[#444] text-sm text-center py-8">No results for &quot;{query}&quot;</p>
                ) : (
                  results.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href}
                        onClick={() => go(item.href)}
                        onMouseEnter={() => setActive(i)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          active === i ? 'bg-white/[0.05]' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          active === i ? 'bg-[#DC5B17]/15 text-[#DC5B17]' : 'bg-white/[0.04] text-[#555]'
                        }`}>
                          <Icon size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${active === i ? 'text-white' : 'text-[#888]'}`}>{item.label}</p>
                          <p className="text-[#444] text-xs truncate">{item.description}</p>
                        </div>
                        {active === i && (
                          <kbd className="text-[9px] bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded text-[#555]">↵</kbd>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/[0.06] text-[#333] text-[10px]">
                <span><kbd className="bg-white/[0.04] px-1 py-0.5 rounded mr-1">↑↓</kbd>Navigate</span>
                <span><kbd className="bg-white/[0.04] px-1 py-0.5 rounded mr-1">↵</kbd>Open</span>
                <span><kbd className="bg-white/[0.04] px-1 py-0.5 rounded mr-1">ESC</kbd>Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
