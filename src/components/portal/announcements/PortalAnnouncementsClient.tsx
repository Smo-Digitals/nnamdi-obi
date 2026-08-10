'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MegaphoneSimple } from 'phosphor-react';
import { type Announcement, type ViewMode } from './announcementUtils';
import { AnnouncementCard } from './AnnouncementCard';
import { AnnouncementRow } from './AnnouncementRow';
import { ViewToggle } from './ViewToggle';

interface Props {
  announcements: Announcement[];
  initialViewMode: ViewMode;
}

function AnnouncementList({ items, mode }: { items: Announcement[]; mode: ViewMode }) {
  if (mode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((a) => <AnnouncementCard key={a.id} a={a} />)}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {items.map((a) => <AnnouncementRow key={a.id} a={a} />)}
    </div>
  );
}

export function PortalAnnouncementsClient({ announcements, initialViewMode }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  function handleViewChange(mode: ViewMode) {
    setViewMode(mode);
    const query = mode === 'list' ? '?view=list' : '';
    router.replace(`${pathname}${query}`, { scroll: false });
  }

  if (announcements.length === 0) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>Announcements</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--adm-muted)' }}>Stay up to date with the latest news.</p>
        </div>
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <div className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-4"
            style={{ borderColor: 'var(--adm-border)' }}>
            <MegaphoneSimple size={24} className="text-[#333]" />
          </div>
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--adm-text)' }}>No announcements yet</p>
          <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>Check back soon for updates.</p>
        </div>
      </div>
    );
  }

  const pinned   = announcements.filter((a) => a.pinned);
  const unpinned = announcements.filter((a) => !a.pinned);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>Announcements</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--adm-muted)' }}>
            {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
          </p>
        </div>
        <ViewToggle mode={viewMode} onChange={handleViewChange} />
      </div>

      {pinned.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--adm-muted)' }}>Pinned</p>
          <AnnouncementList items={pinned} mode={viewMode} />
        </div>
      )}

      {unpinned.length > 0 && (
        <div>
          {pinned.length > 0 && (
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--adm-muted)' }}>Latest</p>
          )}
          <AnnouncementList items={unpinned} mode={viewMode} />
        </div>
      )}
    </div>
  );
}
