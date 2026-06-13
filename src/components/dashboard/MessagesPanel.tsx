'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, MagnifyingGlass, PaperPlaneTilt } from 'phosphor-react';

type Conversation = {
  id: string;
  name: string;
  initials: string;
  color: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

const CONVOS: Conversation[] = [
  { id: '1', name: 'Adaeze Okonkwo', initials: 'AO', color: '#DC5B17', lastMessage: 'Thank you so much! I just completed module 3 and it was amazing.', time: '2m',   unread: 2, online: true  },
  { id: '2', name: 'Emeka Nwosu',    initials: 'EN', color: '#22c55e', lastMessage: 'When does the next cohort start? I want to bring my team.',          time: '18m',  unread: 1, online: true  },
  { id: '3', name: 'Chioma Eze',     initials: 'CE', color: '#eab308', lastMessage: 'Got it, thanks! Will send the payment before end of day.',            time: '1h',   unread: 0, online: false },
  { id: '4', name: 'Tunde Adeyemi',  initials: 'TA', color: '#8b5cf6', lastMessage: 'Can you share the slides from the last session?',                     time: '3h',   unread: 0, online: false },
  { id: '5', name: 'Ngozi Okafor',   initials: 'NO', color: '#f43f5e', lastMessage: 'This community is changing my life, honestly.',                       time: '1d',   unread: 0, online: false },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MessagesPanel({ open, onClose }: Props) {
  const [search, setSearch] = useState('');

  const totalUnread = CONVOS.reduce((s, c) => s + c.unread, 0);

  const filtered = CONVOS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full w-[400px] bg-[#0e0e0e] border-l border-white/[0.07] z-50 flex flex-col shadow-2xl shadow-black/60"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <h2 className="text-white font-semibold text-base">Messages</h2>
                {totalUnread > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DC5B17] text-white">
                    {totalUnread}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#555] hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#444]">
                <MagnifyingGlass size={14} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search messages…"
                  className="flex-1 text-sm bg-transparent text-white placeholder:text-[#444] outline-none"
                />
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#444] text-sm">
                  No conversations found
                </div>
              ) : (
                filtered.map((c) => (
                  <Link
                    key={c.id}
                    href={`/admin/messages/${c.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: `${c.color}30`, color: c.color }}
                      >
                        {c.initials}
                      </div>
                      {c.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0e0e0e]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-sm font-medium truncate ${c.unread > 0 ? 'text-white' : 'text-[#888]'}`}>
                          {c.name}
                        </p>
                        <span className="text-[10px] text-[#444] shrink-0 ml-2">{c.time}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs truncate ${c.unread > 0 ? 'text-[#888]' : 'text-[#444]'}`}>
                          {c.lastMessage}
                        </p>
                        {c.unread > 0 && (
                          <span className="w-5 h-5 rounded-full bg-[#DC5B17] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {c.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] p-4 flex gap-3">
              <Link
                href="/admin/messages"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#888] text-sm hover:text-white hover:bg-white/[0.07] transition-colors"
              >
                See all messages <ArrowRight size={14} />
              </Link>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#DC5B17] text-white hover:bg-[#c44f13] transition-colors shrink-0">
                <PaperPlaneTilt size={16} weight="fill" />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
