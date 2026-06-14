'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  MagnifyingGlass, Bell, ChatCircle, UserCircle,
  Gear, CaretRight, SignOut, Sun, Moon,
} from 'phosphor-react';
import { logout } from '@/app/(auth)/actions';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function AvatarDropdown() {
  const [open,      setOpen]      = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName,  setFullName]  = useState('');
  const [email,     setEmail]     = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) return;
        setEmail(user.email ?? '');
        supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single()
          .then(({ data }) => {
            if (data?.full_name) setFullName(data.full_name);
            if (data?.avatar_url) setAvatarUrl(data.avatar_url);
          });
      });
    });
  }, []);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const initials = fullName.split(' ').map((n) => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div ref={ref} className="relative ml-1">
      <button onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-1 rounded-xl hover:bg-white/[0.06] transition-colors">
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#DC5B17] flex items-center justify-center text-white text-xs font-bold overflow-hidden">
            {avatarUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              : initials}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#050505]" />
        </div>
        <CaretRight size={11} className={`text-[#555] transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-12 w-60 rounded-2xl border shadow-2xl shadow-black/60 overflow-hidden z-50"
            style={{ backgroundColor: 'var(--adm-drop)', borderColor: 'var(--adm-border)' }}
          >
            <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--adm-border)' }}>
              <div className="w-10 h-10 rounded-xl bg-[#DC5B17] flex items-center justify-center text-white font-bold overflow-hidden shrink-0">
                {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--adm-text)' }}>{fullName || 'Member'}</p>
                <p className="text-xs truncate" style={{ color: 'var(--adm-muted)' }}>{email}</p>
              </div>
            </div>
            <div className="p-2">
              {[
                { label: 'Profile',  icon: UserCircle, href: '/home/profile'  },
                { label: 'Settings', icon: Gear,       href: '/home/settings' },
              ].map(({ label, icon: Icon, href }) => (
                <Link key={label} href={href} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors group"
                  style={{ color: 'var(--adm-muted)' }}>
                  <Icon size={16} />
                  <span className="flex-1">{label}</span>
                  <CaretRight size={12} className="text-[#333] group-hover:text-[#555]" />
                </Link>
              ))}
            </div>
            <div className="p-2 pt-0 border-t" style={{ borderColor: 'var(--adm-border)' }}>
              <form action={logout}>
                <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#555] hover:text-red-400 hover:bg-white/5 transition-colors">
                  <SignOut size={16} />
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

export function PortalHeader() {
  const [notifCount] = useState(2);
  const [msgCount]   = useState(1);
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-20 shrink-0 relative flex items-center px-8 border-b"
      style={{ backgroundColor: 'var(--adm-header)', borderColor: 'var(--adm-border)' }}>

      <div className="shrink-0">
        <p className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>
          {getGreeting()}
        </p>
        <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>Welcome back to your dashboard.</p>
      </div>

      <button className="absolute left-1/2 -translate-x-1/2 w-72 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-[#444] hover:border-white/10 hover:bg-white/[0.06] transition-colors"
        style={{ backgroundColor: 'var(--adm-pill)', borderColor: 'var(--adm-border)' }}>
        <MagnifyingGlass size={15} />
        <span className="text-sm flex-1 text-left">Search courses, events…</span>
        <kbd className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-[#333]">⌘K</kbd>
      </button>

      <div className="shrink-0 flex items-center gap-5 ml-auto">
        <div className="relative shrink-0">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl border text-[#555] hover:text-white transition-colors"
            style={{ backgroundColor: 'var(--adm-pill)', borderColor: 'var(--adm-border)' }}>
            <ChatCircle size={19} />
          </button>
          {msgCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#DC5B17] text-white text-[9px] font-bold flex items-center justify-center">
              {msgCount}
            </span>
          )}
        </div>

        <div className="relative shrink-0">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl border text-[#555] hover:text-white transition-colors"
            style={{ backgroundColor: 'var(--adm-pill)', borderColor: 'var(--adm-border)' }}>
            <Bell size={19} />
          </button>
          {notifCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#DC5B17] text-white text-[9px] font-bold flex items-center justify-center">
              {notifCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5 pl-1.5 pr-1.5 py-1.5 rounded-2xl border"
          style={{ backgroundColor: 'var(--adm-pill)', borderColor: 'var(--adm-border)' }}>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#555] hover:text-white hover:bg-white/[0.06] transition-colors">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <div className="w-px h-5 bg-white/[0.08] mx-1" />
          <AvatarDropdown />
        </div>
      </div>
    </header>
  );
}
