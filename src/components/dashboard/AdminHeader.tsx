'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlass, Bell, ChatCircle, UserCircle, Wallet, Gear, CaretRight, SignOut } from 'phosphor-react';
import { adminLogout } from '@/app/(auth)/actions';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { MessagesPanel } from '@/components/dashboard/MessagesPanel';
import { SearchModal } from '@/components/dashboard/SearchModal';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const menuItems = [
  { label: 'Profile',  icon: UserCircle, href: '/admin/profile' },
  { label: 'Settings', icon: Gear,        href: '/admin/settings' },
  { label: 'Wallet',   icon: Wallet,      href: '/admin/wallet' },
];

function AvatarDropdown() {
  const [open,      setOpen]      = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName,  setFullName]  = useState('Nnamdi Obi');
  const [email,     setEmail]     = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) return;
        setEmail(user.email ?? '');
        supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data?.full_name) setFullName(data.full_name);
            if (data?.avatar_url) setAvatarUrl(data.avatar_url);
          });
      });
    });
  }, []);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const initials = fullName.split(' ').map((n) => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative ml-1">
      {/* Avatar button + caret */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 pr-1 rounded-xl hover:bg-white/[0.06] transition-colors"
      >
        <div className="relative w-8 h-8 rounded-xl bg-[#DC5B17] flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
          {avatarUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            : initials
          }
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#050505]" />
        </div>
        <CaretRight size={11} className={`text-[#444] transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-11 w-64 rounded-2xl bg-[#111] border border-white/[0.08] shadow-2xl shadow-black/60 overflow-hidden z-50">

          {/* Profile header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-xl bg-[#DC5B17] flex items-center justify-center text-white font-bold text-base overflow-hidden">
                {avatarUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  : initials
                }
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#111]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{fullName}</p>
              <p className="text-[#555] text-xs truncate">{email}</p>
            </div>
            <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DC5B17]/15 text-[#DC5B17] border border-[#DC5B17]/20">
              ADMIN
            </span>
          </div>

          {/* Menu items */}
          <div className="p-2">
            {menuItems.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#888] hover:text-white hover:bg-white/5 transition-colors group"
              >
                <Icon size={17} />
                <span className="flex-1 text-sm">{label}</span>
                <CaretRight size={13} className="text-[#333] group-hover:text-[#555] transition-colors" />
              </Link>
            ))}
          </div>

          {/* Sign out */}
          <div className="p-2 pt-0 border-t border-white/[0.06]">
            <form action={adminLogout}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#555] hover:text-red-400 hover:bg-white/5 transition-colors text-sm"
              >
                <SignOut size={17} />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminHeader() {
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [msgOpen,    setMsgOpen]    = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(3);
  const [msgCount,   setMsgCount]   = useState(3);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
    <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} onRead={(n) => setNotifCount((c) => Math.max(0, c - n))} />
    <MessagesPanel open={msgOpen} onClose={() => setMsgOpen(false)} onRead={(n) => setMsgCount((c) => Math.max(0, c - n))} />
    <header className="h-16 shrink-0 flex items-center px-8 border-b border-white/[0.06] bg-[#050505]">

      {/* Greeting — left */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">
          {getGreeting()}, Nnamdi
        </p>
        <p className="text-[#444] text-xs">Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Search — centre */}
      <button
        onClick={() => setSearchOpen(true)}
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#444] w-72 hover:border-white/10 hover:bg-white/[0.06] transition-colors"
      >
        <MagnifyingGlass size={15} />
        <span className="text-sm flex-1 text-left">Search anything…</span>
        <kbd className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-[#333]">⌘K</kbd>
      </button>

      {/* Right — icon group + avatar in one pill container */}
      <div className="flex-1 flex justify-end">
        <div className="flex items-center gap-1 pl-2 pr-1 py-1 rounded-2xl bg-white/[0.03] border border-white/[0.06]">

          {/* Messages */}
          <button
            onClick={() => setMsgOpen(true)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#555] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <ChatCircle size={18} />
            {msgCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-[#DC5B17] text-white text-[9px] font-bold flex items-center justify-center">
                {msgCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={() => setNotifOpen(true)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#555] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Bell size={18} />
            {notifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-[#DC5B17] text-white text-[9px] font-bold flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-white/[0.08] mx-1" />

          {/* Avatar + caret */}
          <AvatarDropdown />

        </div>
      </div>

    </header>
    </>
  );
}
