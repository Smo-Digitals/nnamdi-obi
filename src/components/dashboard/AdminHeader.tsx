'use client';

import { MagnifyingGlass, Bell, ChatCircle, UserCircle } from 'phosphor-react';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function AdminHeader() {
  return (
    <header className="h-16 shrink-0 flex items-center gap-6 px-8 border-b border-white/[0.06] bg-[#050505]">

      {/* Greeting */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">
          {getGreeting()}, Nnamdi
        </p>
        <p className="text-[#444] text-xs">Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#444] w-64 hover:border-white/10 transition-colors cursor-text">
        <MagnifyingGlass size={15} />
        <span className="text-sm flex-1">Search anything…</span>
        <kbd className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-[#333]">⌘K</kbd>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Messages */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#444] hover:text-white hover:bg-white/5 transition-colors">
          <ChatCircle size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#DC5B17]" />
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#444] hover:text-white hover:bg-white/5 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#DC5B17]" />
        </button>

        {/* Avatar */}
        <button className="ml-1 w-8 h-8 rounded-full bg-[#DC5B17] flex items-center justify-center text-white text-xs font-bold hover:bg-[#c44f13] transition-colors">
          N
        </button>
      </div>

    </header>
  );
}
