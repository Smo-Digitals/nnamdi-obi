'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, MagnifyingGlass, PaperPlaneTilt, ArrowLeft, Circle } from 'phosphor-react';

type Message = { id: string; from: 'me' | 'them'; text: string; time: string };
type Conversation = {
  id: string;
  name: string;
  initials: string;
  color: string;
  online: boolean;
  unread: number;
  messages: Message[];
};

const INITIAL_CONVOS: Conversation[] = [
  {
    id: '1', name: 'Adaeze Okonkwo', initials: 'AO', color: '#DC5B17', online: true, unread: 2,
    messages: [
      { id: 'm1', from: 'them', text: 'Hi Nnamdi! I just joined the community.',                          time: '10:02 AM' },
      { id: 'm2', from: 'me',   text: 'Welcome Adaeze! So glad to have you here.',                        time: '10:05 AM' },
      { id: 'm3', from: 'them', text: 'Thank you! I just completed module 3 and it was amazing.',         time: '10:08 AM' },
      { id: 'm4', from: 'them', text: 'When does module 4 drop?',                                         time: '10:09 AM' },
    ],
  },
  {
    id: '2', name: 'Emeka Nwosu', initials: 'EN', color: '#22c55e', online: true, unread: 1,
    messages: [
      { id: 'm1', from: 'them', text: 'Hey, I enrolled in Tech Foundations yesterday.',                   time: 'Yesterday' },
      { id: 'm2', from: 'me',   text: 'Great to have you! Let me know if you need anything.',             time: 'Yesterday' },
      { id: 'm3', from: 'them', text: 'When does the next cohort start? I want to bring my team.',        time: '9:30 AM' },
    ],
  },
  {
    id: '3', name: 'Chioma Eze', initials: 'CE', color: '#eab308', online: false, unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Is there a payment plan available?',                               time: '2d ago' },
      { id: 'm2', from: 'me',   text: 'Yes! You can split into 2 installments.',                          time: '2d ago' },
      { id: 'm3', from: 'them', text: 'Got it, thanks! Will send the payment before end of day.',         time: '2d ago' },
    ],
  },
  {
    id: '4', name: 'Tunde Adeyemi', initials: 'TA', color: '#8b5cf6', online: false, unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Can you share the slides from the last session?',                  time: '3d ago' },
      { id: 'm2', from: 'me',   text: 'Sure! Check your email, just sent them over.',                     time: '3d ago' },
    ],
  },
  {
    id: '5', name: 'Ngozi Okafor', initials: 'NO', color: '#f43f5e', online: false, unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'This community is changing my life, honestly.',                    time: '1w ago' },
      { id: 'm2', from: 'me',   text: 'That means everything to me, thank you Ngozi!',                   time: '1w ago' },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onRead: (count: number) => void;
}

export function MessagesPanel({ open, onClose, onRead }: Props) {
  const [convos, setConvos]       = useState<Conversation[]>(INITIAL_CONVOS);
  const [search, setSearch]       = useState('');
  const [activeId, setActiveId]   = useState<string | null>(null);
  const [draft, setDraft]         = useState('');
  const bottomRef                 = useRef<HTMLDivElement>(null);

  const totalUnread = convos.reduce((s, c) => s + c.unread, 0);
  const active      = convos.find((c) => c.id === activeId) ?? null;
  const filtered    = convos.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages.length]);

  function openConvo(id: string) {
    const convo = convos.find((c) => c.id === id);
    if (convo && convo.unread > 0) onRead(convo.unread);
    setActiveId(id);
    setConvos((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  function send() {
    if (!draft.trim() || !activeId) return;
    setConvos((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, { id: Date.now().toString(), from: 'me', text: draft.trim(), time: 'Now' }] }
          : c
      )
    );
    setDraft('');
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full w-[400px] bg-[#0e0e0e] border-l border-white/[0.07] z-50 flex flex-col shadow-2xl shadow-black/60"
          >
            {/* ── LIST VIEW ── */}
            {!active && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <h2 className="text-white font-semibold text-base">Messages</h2>
                    {totalUnread > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DC5B17] text-white">{totalUnread}</span>
                    )}
                  </div>
                  <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#555] hover:text-white hover:bg-white/5 transition-colors">
                    <X size={16} />
                  </button>
                </div>

                {/* Search */}
                <div className="px-6 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#444]">
                    <MagnifyingGlass size={14} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search messages…"
                      className="flex-1 text-sm bg-transparent text-white placeholder:text-[#444] outline-none" />
                  </div>
                </div>

                {/* Conversation list */}
                <div className="flex-1 overflow-y-auto">
                  {filtered.map((c) => (
                    <button key={c.id} onClick={() => openConvo(c.id)}
                      className="w-full flex items-center gap-4 px-6 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors text-left"
                    >
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: `${c.color}25`, color: c.color }}>{c.initials}</div>
                        {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0e0e0e]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className={`text-sm font-medium truncate ${c.unread > 0 ? 'text-white' : 'text-[#888]'}`}>{c.name}</p>
                          {c.unread > 0 && (
                            <span className="w-5 h-5 rounded-full bg-[#DC5B17] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{c.unread}</span>
                          )}
                        </div>
                        <p className={`text-xs truncate ${c.unread > 0 ? 'text-[#888]' : 'text-[#444]'}`}>{c.messages.at(-1)?.text}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-white/[0.06] p-4 flex gap-3">
                  <Link href="/admin/messages" onClick={onClose}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#888] text-sm hover:text-white hover:bg-white/[0.07] transition-colors">
                    See all messages <ArrowRight size={14} />
                  </Link>
                </div>
              </>
            )}

            {/* ── CHAT VIEW ── */}
            {active && (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
                  <button onClick={() => setActiveId(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#555] hover:text-white hover:bg-white/5 transition-colors shrink-0">
                    <ArrowLeft size={16} />
                  </button>
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: `${active.color}25`, color: active.color }}>{active.initials}</div>
                    {active.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#0e0e0e]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{active.name}</p>
                    <p className="text-[#444] text-[10px] flex items-center gap-1">
                      {active.online
                        ? <><Circle size={6} weight="fill" className="text-green-500" /> Online</>
                        : 'Offline'}
                    </p>
                  </div>
                  <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#555] hover:text-white hover:bg-white/5 transition-colors shrink-0">
                    <X size={16} />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
                  {active.messages.map((m) => (
                    <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[78%] flex flex-col gap-1 ${m.from === 'me' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          m.from === 'me'
                            ? 'bg-[#DC5B17] text-white rounded-br-sm'
                            : 'bg-white/[0.06] text-[#ccc] rounded-bl-sm'
                        }`}>
                          {m.text}
                        </div>
                        <span className="text-[10px] text-[#333] px-1">{m.time}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {/* Reply input */}
                <div className="px-5 py-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                      placeholder={`Reply to ${active.name}…`}
                      className="flex-1 text-sm bg-transparent text-white placeholder:text-[#444] outline-none"
                      autoFocus
                    />
                    <button onClick={send} disabled={!draft.trim()}
                      className="w-8 h-8 rounded-xl bg-[#DC5B17] flex items-center justify-center text-white hover:bg-[#c44f13] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0">
                      <PaperPlaneTilt size={15} weight="fill" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
