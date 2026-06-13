'use client';

import { useState } from 'react';
import { Users, BookOpen, CurrencyDollar, Bell, CheckCircle, Funnel } from 'phosphor-react';

type Notification = {
  id: string;
  type: 'member' | 'course' | 'payment' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const ALL: Notification[] = [
  { id: '1',  type: 'member',  title: 'New member joined',        body: 'Adaeze Okonkwo just enrolled in Business Growth Masterclass.',  time: '2m ago',   read: false },
  { id: '2',  type: 'payment', title: 'Payment received',          body: '₦15,000 from Emeka Nwosu for Tech Foundations.',                time: '14m ago',  read: false },
  { id: '3',  type: 'member',  title: 'New member joined',        body: 'Chioma Eze signed up and is exploring your community.',          time: '1h ago',   read: false },
  { id: '4',  type: 'course',  title: 'Course milestone reached',  body: 'Leadership 101 just hit 100 enrolled members.',                 time: '3h ago',   read: true  },
  { id: '5',  type: 'payment', title: 'Payment received',          body: '₦8,500 from Tunde Adeyemi for Leadership 101.',                 time: '5h ago',   read: true  },
  { id: '6',  type: 'system',  title: 'System update',             body: 'Your community platform was updated to the latest version.',    time: '1d ago',   read: true  },
  { id: '7',  type: 'member',  title: 'New member joined',        body: 'Ngozi Okafor enrolled in Tech Foundations.',                     time: '1d ago',   read: true  },
  { id: '8',  type: 'payment', title: 'Payment received',          body: '₦12,000 from Uche Dike for Business Growth Masterclass.',       time: '2d ago',   read: true  },
  { id: '9',  type: 'course',  title: 'New course review',         body: 'Someone left a 5-star review on Business Growth Masterclass.',  time: '2d ago',   read: true  },
  { id: '10', type: 'system',  title: 'Login from new device',     body: 'A new sign-in was detected from Lagos, Nigeria.',               time: '3d ago',   read: true  },
];

const iconMap = {
  member:  { icon: Users,          bg: 'bg-[#DC5B17]/10', color: 'text-[#DC5B17]' },
  course:  { icon: BookOpen,       bg: 'bg-blue-500/10',  color: 'text-blue-400'  },
  payment: { icon: CurrencyDollar, bg: 'bg-green-500/10', color: 'text-green-400' },
  system:  { icon: Bell,           bg: 'bg-white/5',      color: 'text-[#666]'    },
};

const filters = ['All', 'Unread', 'Members', 'Payments', 'Courses', 'System'] as const;
type Filter = typeof filters[number];

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(ALL);
  const [active, setActive] = useState<Filter>('All');

  const unreadCount = items.filter((n) => !n.read).length;

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const filtered = items.filter((n) => {
    if (active === 'Unread')   return !n.read;
    if (active === 'Members')  return n.type === 'member';
    if (active === 'Payments') return n.type === 'payment';
    if (active === 'Courses')  return n.type === 'course';
    if (active === 'System')   return n.type === 'system';
    return true;
  });

  return (
    <div className="p-8 max-w-3xl">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Notifications</h1>
          <p className="text-[#444] text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-[#888] text-sm hover:text-white hover:bg-white/[0.07] transition-colors"
          >
            <CheckCircle size={15} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Funnel size={14} className="text-[#444]" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              active === f
                ? 'bg-white/10 text-white'
                : 'text-[#555] hover:text-white hover:bg-white/5'
            }`}
          >
            {f}
            {f === 'Unread' && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#DC5B17] text-white text-[10px]">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-[#0e0e0e] border border-white/[0.06] rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell size={32} className="text-[#333] mb-3" />
            <p className="text-[#555] text-sm">No notifications here</p>
          </div>
        ) : (
          filtered.map((n, i) => {
            const { icon: Icon, bg, color } = iconMap[n.type];
            return (
              <div
                key={n.id}
                className={`flex gap-4 px-6 py-4 group transition-colors ${
                  i < filtered.length - 1 ? 'border-b border-white/[0.04]' : ''
                } ${n.read ? 'opacity-50' : 'hover:bg-white/[0.02]'}`}
              >
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={17} className={color} weight="fill" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-white text-sm font-medium leading-snug">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-[#DC5B17] shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-[#555] text-xs leading-relaxed mt-0.5">{n.body}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-[#333] text-[10px]">{n.time}</p>
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="text-[10px] text-[#DC5B17] hover:underline underline-offset-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
