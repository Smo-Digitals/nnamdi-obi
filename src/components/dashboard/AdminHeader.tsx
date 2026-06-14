'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { MagnifyingGlass, Bell, ChatCircle, UserCircle, Wallet, Gear, CaretRight, SignOut, Sun, Moon } from 'phosphor-react';
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
        className="flex items-center gap-2 px-1 rounded-xl hover:bg-white/[0.06] transition-colors"
      >
        {/* outer relative wrapper so online dot sits outside overflow-hidden */}
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#DC5B17] flex items-center justify-center text-white text-xs font-bold overflow-hidden">
            {avatarUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              : initials
            }
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#050505]" />
        </div>
        <CaretRight size={11} className={`text-[#555] transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -6 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-0 top-12 w-64 rounded-2xl border shadow-2xl shadow-black/60 overflow-hidden z-50"
          style={{ backgroundColor: 'var(--adm-drop)', borderColor: 'var(--adm-border)' }}
        >

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
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

export function AdminHeader() {
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [msgOpen,    setMsgOpen]    = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(3);
  const [msgCount,   setMsgCount]   = useState(3);
  const { theme, setTheme } = useTheme();

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
    <header className="h-20 shrink-0 relative flex items-center px-8 border-b" style={{ backgroundColor: 'var(--adm-header)', borderColor: 'var(--adm-border)' }}>

      {/* Greeting — left */}
      <div className="shrink-0">
        <p className="text-white font-semibold text-sm">
          {getGreeting()}, Nnamdi
        </p>
        <p className="text-[#444] text-xs">Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Search — absolutely centred, fixed width */}
      <button
        onClick={() => setSearchOpen(true)}
        className="absolute left-1/2 -translate-x-1/2 w-72 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#444] hover:border-white/10 hover:bg-white/[0.06] transition-colors"
      >
        <MagnifyingGlass size={15} />
        <span className="text-sm flex-1 text-left">Search anything…</span>
        <kbd className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-[#333]">⌘K</kbd>
      </button>

      {/* Right */}
      <div className="shrink-0 flex items-center gap-5 ml-auto">

        {/* Messages — icon box */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMsgOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border text-[#555] hover:text-white transition-colors"
            style={{ backgroundColor: 'var(--adm-pill)', borderColor: 'var(--adm-border)' }}
          >
            <ChatCircle size={19} />
          </button>
          {msgCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#DC5B17] text-white text-[9px] font-bold flex items-center justify-center leading-none shadow-sm">
              {msgCount}
            </span>
          )}
        </div>

        {/* Notifications — icon box */}
        <div className="relative shrink-0">
          <button
            onClick={() => setNotifOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border text-[#555] hover:text-white transition-colors"
            style={{ backgroundColor: 'var(--adm-pill)', borderColor: 'var(--adm-border)' }}
          >
            <Bell size={19} />
          </button>
          {notifCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#DC5B17] text-white text-[9px] font-bold flex items-center justify-center leading-none shadow-sm">
              {notifCount}
            </span>
          )}
        </div>

        {/* Pill: toggle + avatar */}
        <div className="flex items-center gap-0.5 pl-1.5 pr-1.5 py-1.5 rounded-2xl border" style={{ backgroundColor: 'var(--adm-pill)', borderColor: 'var(--adm-border)' }}>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#555] hover:text-white hover:bg-white/[0.06] transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
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
