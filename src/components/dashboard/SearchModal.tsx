'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlass, X, SquaresFour, ChartBar, BookOpen,
  UsersThree, ChatCircle, Bell, Gear, User, PencilSimpleLine,
  Storefront, CalendarBlank, CalendarCheck, CurrencyDollar,
  EnvelopeSimple, Users, Megaphone, Image, House, TextAlignLeft,
  FolderSimple, Star, ChatDots, PencilCircle, Signpost, Package,
  ShoppingCart, Handshake, Radio, Lock, UsersFour, Tag,
  ChartLine, Money,
} from 'phosphor-react';

type Item = { label: string; description: string; href: string; icon: React.ElementType; group: string };

const ALL_ITEMS: Item[] = [
  // Dashboard
  { label: 'Overview',          description: 'Dashboard overview and stats',           href: '/admin',                        icon: SquaresFour,      group: 'Dashboard'   },
  { label: 'Announcements',     description: 'Publish announcements',                  href: '/admin/announcements',          icon: Megaphone,        group: 'Dashboard'   },
  { label: 'Media Library',     description: 'Manage images and files',                href: '/admin/media',                  icon: Image,            group: 'Dashboard'   },
  { label: 'Homepage',          description: 'Customise homepage content',             href: '/admin/homepage',               icon: House,            group: 'Dashboard'   },
  // Writing
  { label: 'All Posts',         description: 'Manage published and draft posts',       href: '/admin/writing/posts',          icon: TextAlignLeft,    group: 'Writing'     },
  { label: 'Create Post',       description: 'Write a new post',                       href: '/admin/writing/create',         icon: PencilSimpleLine, group: 'Writing'     },
  { label: 'Post Categories',   description: 'Organise posts by category',             href: '/admin/writing/categories',     icon: Tag,              group: 'Writing'     },
  { label: 'Post Metrics',      description: 'Views, reads, and engagement',           href: '/admin/writing/metrics',        icon: ChartLine,        group: 'Writing'     },
  { label: 'Curated Write-ups', description: 'Feature top community content',          href: '/admin/writing/curated',        icon: Star,             group: 'Writing'     },
  { label: 'Comments',          description: 'Moderate reader comments',               href: '/admin/writing/comments',       icon: ChatDots,         group: 'Writing'     },
  { label: 'Editors',           description: 'Manage writing collaborators',           href: '/admin/writing/editors',        icon: PencilCircle,     group: 'Writing'     },
  // Courses
  { label: 'Roadmaps',          description: 'Structured learning paths',              href: '/admin/courses/roadmaps',       icon: Signpost,         group: 'Courses'     },
  { label: 'All Courses',       description: 'Manage all courses',                     href: '/admin/courses/all',            icon: BookOpen,         group: 'Courses'     },
  { label: 'Curated Content',   description: 'Featured course picks',                  href: '/admin/courses/curated',        icon: Star,             group: 'Courses'     },
  { label: 'Course Categories', description: 'Organise courses by topic',              href: '/admin/courses/categories',     icon: Tag,              group: 'Courses'     },
  { label: 'Bundles',           description: 'Package courses together',               href: '/admin/courses/bundles',        icon: Package,          group: 'Courses'     },
  { label: 'Course Files',      description: 'Assets and downloadable files',          href: '/admin/courses/files',          icon: FolderSimple,     group: 'Courses'     },
  { label: 'Course Metrics',    description: 'Enrolments and completions',             href: '/admin/courses/metrics',        icon: ChartLine,        group: 'Courses'     },
  // Marketplace
  { label: 'Templates',         description: 'Sell and manage templates',              href: '/admin/marketplace/templates',  icon: Storefront,       group: 'Market Place'},
  { label: 'Group Buy',         description: 'Manage group purchasing deals',          href: '/admin/marketplace/group-buy',  icon: ShoppingCart,     group: 'Market Place'},
  { label: 'Partnerships',      description: 'Partner integrations',                   href: '/admin/marketplace/partnerships',icon: Handshake,       group: 'Market Place'},
  // Events
  { label: 'Curated Events',    description: 'Featured and curated events',            href: '/admin/events/curated',         icon: CalendarBlank,    group: 'Events'      },
  { label: 'Private Events',    description: 'Invite-only events',                     href: '/admin/events/private',         icon: Lock,             group: 'Events'      },
  { label: 'Live Events',       description: 'Stream and manage live sessions',        href: '/admin/events/live',            icon: Radio,            group: 'Events'      },
  // Community
  { label: 'Active Communities',description: 'View active community spaces',           href: '/admin/community/active',       icon: UsersThree,       group: 'Community'   },
  { label: 'Create Community',  description: 'Start a new community',                  href: '/admin/community/create',       icon: UsersFour,        group: 'Community'   },
  { label: 'Members',           description: 'Manage community members',               href: '/admin/community/members',      icon: Users,            group: 'Community'   },
  // Booking
  { label: 'Create Booking',    description: 'Set up a new booking slot',              href: '/admin/booking/create',         icon: CalendarCheck,    group: 'Booking'     },
  { label: 'Booking Categories',description: 'Organise bookings by type',              href: '/admin/booking/categories',     icon: Tag,              group: 'Booking'     },
  { label: 'All Bookings',      description: 'View all booking requests',              href: '/admin/booking/all',            icon: CalendarCheck,    group: 'Booking'     },
  // Financials
  { label: 'Earnings',          description: 'Revenue and payouts',                    href: '/admin/financials/earnings',    icon: CurrencyDollar,   group: 'Financials'  },
  { label: 'Money Metrics',     description: 'Detailed financial analytics',           href: '/admin/financials/metrics',     icon: Money,            group: 'Financials'  },
  // Emails
  { label: 'Newsletters',       description: 'Create and send newsletters',            href: '/admin/emails/newsletters',     icon: EnvelopeSimple,   group: 'Emails'      },
  { label: 'All Letters',       description: 'All sent and drafted emails',            href: '/admin/emails/all',             icon: EnvelopeSimple,   group: 'Emails'      },
  { label: 'Email Issues',      description: 'Delivery issues and bounces',            href: '/admin/emails/issues',          icon: EnvelopeSimple,   group: 'Emails'      },
  { label: 'Updates',           description: 'Send product and community updates',     href: '/admin/emails/updates',         icon: EnvelopeSimple,   group: 'Emails'      },
  // Analytics
  { label: 'Finance Analytics', description: 'Revenue and financial insights',         href: '/admin/analytics/finance',      icon: ChartBar,         group: 'Analytics'   },
  { label: 'User Analytics',    description: 'User behaviour and growth metrics',      href: '/admin/analytics/users',        icon: ChartBar,         group: 'Analytics'   },
  { label: 'App Analytics',     description: 'Platform performance and usage',         href: '/admin/analytics/app',          icon: ChartBar,         group: 'Analytics'   },
  // Users
  { label: 'All Users',         description: 'Manage all registered users',            href: '/admin/users/all',              icon: Users,            group: 'Users'       },
  { label: 'User Editors',      description: 'Manage editors and contributors',        href: '/admin/users/editors',          icon: PencilCircle,     group: 'Users'       },
  // System
  { label: 'Messages',          description: 'Inbox and conversations',                href: '/admin/messages',               icon: ChatCircle,       group: 'System'      },
  { label: 'Notifications',     description: 'Alerts and updates',                     href: '/admin/notifications',          icon: Bell,             group: 'System'      },
  { label: 'Profile',           description: 'Update your profile',                    href: '/admin/profile',                icon: User,             group: 'System'      },
  { label: 'Settings',          description: 'Configure your workspace',               href: '/admin/settings',               icon: Gear,             group: 'System'      },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: Props) {
  const [query,  setQuery]  = useState('');
  const [active, setActive] = useState(0);
  const inputRef            = useRef<HTMLInputElement>(null);
  const router              = useRouter();

  const results = query.trim()
    ? ALL_ITEMS.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.description.toLowerCase().includes(query.toLowerCase()) ||
        i.group.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_ITEMS.slice(0, 8);

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
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter')     { if (results[active]) go(results[active].href); }
    if (e.key === 'Escape')    { onClose(); }
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
            className="fixed top-[16%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
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
                  placeholder="Search pages, sections…"
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
              <div className="max-h-80 overflow-y-auto py-1.5">
                {!query.trim() && (
                  <p className="px-4 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[#333]">Quick nav</p>
                )}
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
                        <span className="text-[10px] text-[#333] shrink-0">{item.group}</span>
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
                {query.trim() && <span className="ml-auto">{results.length} result{results.length !== 1 ? 's' : ''}</span>}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
