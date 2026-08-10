'use client';

import Link from 'next/link';
import { PushPin, ArrowRight, MegaphoneSimple, PlayCircle } from 'phosphor-react';
import { type Announcement, stripHtml, getYoutubeThumbnail, formatDate } from './announcementUtils';

export function AnnouncementRow({ a }: { a: Announcement }) {
  const thumb = a.cover_video_url ? getYoutubeThumbnail(a.cover_video_url) : null;
  const cover = thumb ?? a.cover_image_url ?? null;

  return (
    <Link
      href={`/home/announcements/${a.id}`}
      className="group flex items-center gap-4 rounded-2xl border p-3 transition-all hover:border-white/15"
      style={{
        backgroundColor: a.pinned ? 'color-mix(in srgb, #DC5B17 5%, var(--adm-card))' : 'var(--adm-card)',
        borderColor:     a.pinned ? 'color-mix(in srgb, #DC5B17 20%, transparent)' : 'var(--adm-border)',
      }}
    >
      {cover ? (
        <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-black/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt={a.title} className="w-full h-full object-cover" />
          {a.cover_video_url && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <PlayCircle size={20} weight="fill" className="text-white/90" />
            </div>
          )}
        </div>
      ) : (
        <div className="w-16 h-16 shrink-0 rounded-xl border flex items-center justify-center"
          style={{ borderColor: 'var(--adm-border)' }}>
          <MegaphoneSimple size={20} className="text-[#333]" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {a.pinned && <PushPin size={12} weight="fill" className="text-[#DC5B17] shrink-0" />}
          <h2 className="font-bold text-sm truncate" style={{ color: 'var(--adm-text)' }}>{a.title}</h2>
        </div>
        <p className="text-xs line-clamp-1 leading-relaxed mt-0.5" style={{ color: 'var(--adm-muted)' }}>
          {stripHtml(a.body)}
        </p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className="text-[11px] hidden sm:block" style={{ color: 'var(--adm-muted)' }}>
          {formatDate(a.created_at)}
        </span>
        <ArrowRight size={14} weight="bold" className="text-[#DC5B17] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}
