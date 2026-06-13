'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Users, BookOpen, CurrencyDollar, Bell, ArrowRight } from 'phosphor-react';

type Notification = {
  id: string;
  type: 'member' | 'course' | 'payment' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const INITIAL: Notification[] = [
  { id: '1', type: 'member',  title: 'New member joined',       body: 'Adaeze Okonkwo just enrolled in Business Growth Masterclass.', time: '2m ago',  read: false },
  { id: '2', type: 'payment', title: 'Payment received',         body: '₦15,000 from Emeka Nwosu for Tech Foundations.',               time: '14m ago', read: false },
  { id: '3', type: 'member',  title: 'New member joined',       body: 'Chioma Eze signed up and is exploring your community.',         time: '1h ago',  read: false },
  { id: '4', type: 'course',  title: 'Course milestone reached', body: 'Leadership 101 just hit 100 enrolled members.',                time: '3h ago',  read: true  },
  { id: '5', type: 'payment', title: 'Payment received',         body: '₦8,500 from Tunde Adeyemi for Leadership 101.',                time: '5h ago',  read: true  },
  { id: '6', type: 'system',  title: 'System update',            body: 'Your community platform was updated to the latest version.',   time: '1d ago',  read: true  },
];

const iconMap = {
  member:  { icon: Users,           bg: 'bg-[#DC5B17]/10', color: 'text-[#DC5B17]' },
  course:  { icon: BookOpen,        bg: 'bg-blue-500/10',  color: 'text-blue-400'  },
  payment: { icon: CurrencyDollar,  bg: 'bg-green-500/10', color: 'text-green-400' },
  system:  { icon: Bell,            bg: 'bg-white/5',      color: 'text-[#666]'    },
};

interface Props {
  open: boolean;
  onClose: () => void;
  onRead: (count: number) => void;
}

export function NotificationsPanel({ open, onClose, onRead }: Props) {
  const [items, setItems] = useState<Notification[]>(INITIAL);

  const unreadCount = items.filter((n) => !n.read).length;

  function markRead(id: string) {
    const item = items.find((n) => n.id === id);
    if (item && !item.read) onRead(1);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllRead() {
    const unread = items.filter((n) => !n.read).length;
    onRead(unread);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

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
            className="fixed top-0 right-0 h-full w-[400px] border-l z-50 flex flex-col shadow-2xl shadow-black/40"
            style={{ backgroundColor: 'var(--adm-panel)', borderColor: 'var(--adm-border)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <h2 className="text-white font-semibold text-base">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DC5B17] text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1.5 text-xs text-[#DC5B17] hover:underline underline-offset-2 transition-colors"
                  >
                    <CheckCircle size={13} />
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[#555] hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {/* Unread section */}
              {items.some((n) => !n.read) && (
                <div>
                  <p className="text-[10px] font-semibold text-[#444] uppercase tracking-wider px-6 pt-5 pb-2">
                    Unread
                  </p>
                  {items.filter((n) => !n.read).map((n) => (
                    <NotifItem key={n.id} n={n} onRead={markRead} />
                  ))}
                </div>
              )}

              {/* Read section */}
              {items.some((n) => n.read) && (
                <div>
                  <p className="text-[10px] font-semibold text-[#444] uppercase tracking-wider px-6 pt-5 pb-2">
                    Earlier
                  </p>
                  {items.filter((n) => n.read).map((n) => (
                    <NotifItem key={n.id} n={n} onRead={markRead} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] p-4">
              <Link
                href="/admin/notifications"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#888] text-sm hover:text-white hover:bg-white/[0.07] transition-colors"
              >
                See all notifications <ArrowRight size={14} />
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function NotifItem({ n, onRead }: { n: Notification; onRead: (id: string) => void }) {
  const { icon: Icon, bg, color } = iconMap[n.type];

  return (
    <div
      className={`flex gap-4 px-6 py-4 border-b border-white/[0.04] transition-colors group ${
        n.read ? 'opacity-50' : 'hover:bg-white/[0.02]'
      }`}
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon size={16} className={color} weight="fill" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-white text-sm font-medium leading-snug">{n.title}</p>
          {!n.read && (
            <span className="w-2 h-2 rounded-full bg-[#DC5B17] shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-[#555] text-xs leading-relaxed mt-0.5">{n.body}</p>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-[#383838] text-[10px]">{n.time}</p>
          {!n.read && (
            <button
              onClick={() => onRead(n.id)}
              className="text-[10px] text-[#DC5B17] hover:underline underline-offset-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
