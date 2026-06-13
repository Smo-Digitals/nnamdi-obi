'use client';

import { useState } from 'react';
import { MagnifyingGlass, PaperPlaneTilt, Circle } from 'phosphor-react';

type Message = { id: string; from: 'me' | 'them'; text: string; time: string };

type Conversation = {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
  online: boolean;
  unread: number;
  messages: Message[];
};

const CONVOS: Conversation[] = [
  {
    id: '1', name: 'Adaeze Okonkwo', initials: 'AO', color: '#DC5B17', role: 'Business Growth', online: true, unread: 2,
    messages: [
      { id: 'm1', from: 'them', text: 'Hi Nnamdi! I just joined the community.',                              time: '10:02 AM' },
      { id: 'm2', from: 'me',   text: 'Welcome Adaeze! So glad to have you here.',                            time: '10:05 AM' },
      { id: 'm3', from: 'them', text: 'Thank you so much! I just completed module 3 and it was amazing.',     time: '10:08 AM' },
      { id: 'm4', from: 'them', text: 'When does module 4 drop?',                                             time: '10:09 AM' },
    ],
  },
  {
    id: '2', name: 'Emeka Nwosu', initials: 'EN', color: '#22c55e', role: 'Tech Foundations', online: true, unread: 1,
    messages: [
      { id: 'm1', from: 'them', text: 'Hey, I enrolled in Tech Foundations yesterday.',                       time: 'Yesterday' },
      { id: 'm2', from: 'me',   text: 'Great to have you! Let me know if you need anything.',                 time: 'Yesterday' },
      { id: 'm3', from: 'them', text: 'When does the next cohort start? I want to bring my team.',            time: '9:30 AM'   },
    ],
  },
  {
    id: '3', name: 'Chioma Eze',    initials: 'CE', color: '#eab308', role: 'Business Growth', online: false, unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Is there a payment plan available?',                                   time: '2d ago' },
      { id: 'm2', from: 'me',   text: 'Yes! You can split into 2 installments.',                              time: '2d ago' },
      { id: 'm3', from: 'them', text: 'Got it, thanks! Will send the payment before end of day.',             time: '2d ago' },
    ],
  },
  {
    id: '4', name: 'Tunde Adeyemi', initials: 'TA', color: '#8b5cf6', role: 'Leadership 101', online: false, unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Can you share the slides from the last session?',                      time: '3d ago' },
      { id: 'm2', from: 'me',   text: 'Sure! Check your email, just sent them over.',                         time: '3d ago' },
    ],
  },
  {
    id: '5', name: 'Ngozi Okafor',  initials: 'NO', color: '#f43f5e', role: 'Tech Foundations', online: false, unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'This community is changing my life, honestly.',                        time: '1w ago' },
      { id: 'm2', from: 'me',   text: 'That means everything to me, thank you Ngozi 🙏',                     time: '1w ago' },
    ],
  },
];

export default function MessagesPage() {
  const [search, setSearch]           = useState('');
  const [activeId, setActiveId]       = useState('1');
  const [draft, setDraft]             = useState('');
  const [convos, setConvos]           = useState<Conversation[]>(CONVOS);

  const filtered = convos.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const active = convos.find((c) => c.id === activeId)!;

  function send() {
    if (!draft.trim()) return;
    setConvos((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, { id: Date.now().toString(), from: 'me', text: draft.trim(), time: 'Now' }] }
          : c
      )
    );
    setDraft('');
  }

  function selectConvo(id: string) {
    setActiveId(id);
    setConvos((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">

      {/* Sidebar list */}
      <aside className="w-[300px] shrink-0 border-r border-white/[0.06] flex flex-col">
        {/* Search */}
        <div className="px-4 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#444]">
            <MagnifyingGlass size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="flex-1 text-sm bg-transparent text-white placeholder:text-[#444] outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => selectConvo(c.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.04] transition-colors text-left ${
                activeId === c.id ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="relative shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: `${c.color}25`, color: c.color }}
                >
                  {c.initials}
                </div>
                {c.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0a0a0a]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className={`text-sm font-medium truncate ${c.unread > 0 ? 'text-white' : 'text-[#888]'}`}>{c.name}</p>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#DC5B17] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {c.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#444] truncate">{c.messages.at(-1)?.text}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat window */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="h-16 shrink-0 flex items-center gap-4 px-6 border-b border-white/[0.06]">
          <div className="relative shrink-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: `${active.color}25`, color: active.color }}
            >
              {active.initials}
            </div>
            {active.online && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#050505]" />
            )}
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{active.name}</p>
            <p className="text-[#444] text-xs flex items-center gap-1">
              {active.online
                ? <><Circle size={6} weight="fill" className="text-green-500" /> Online</>
                : 'Offline'
              }
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3">
          {active.messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${m.from === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.from === 'me'
                      ? 'bg-[#DC5B17] text-white rounded-br-sm'
                      : 'bg-white/[0.06] text-[#ccc] rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-[#333] px-1">{m.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder={`Message ${active.name}…`}
              className="flex-1 text-sm bg-transparent text-white placeholder:text-[#444] outline-none"
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              className="w-8 h-8 rounded-xl bg-[#DC5B17] flex items-center justify-center text-white hover:bg-[#c44f13] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              <PaperPlaneTilt size={15} weight="fill" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
