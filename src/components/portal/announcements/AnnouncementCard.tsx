'use client';

import Link from 'next/link';
import { PushPin, ArrowRight, PlayCircle } from 'phosphor-react';
import { type Announcement, stripHtml, getYoutubeThumbnail, formatDate } from './announcementUtils';

export function AnnouncementCard({ a }: { a: Announcement }) {
  const thumb = a.cover_video_url ? getYoutubeThumbnail(a.cover_video_url) : null;
  const cover = thumb ?? a.cover_image_url ?? null;

  return (
    <Link
      href={`/home/announcements/${a.id}`}
      className="group flex flex-col rounded-2xl border overflow-hidden transition-all hover:border-white/15"
      style={{
        backgroundColor: a.pinned ? 'color-mix(in srgb, #DC5B17 5%, var(--adm-card))' : 'var(--adm-card)',
        borderColor:     a.pinned ? 'color-mix(in srgb, #DC5B17 20%, transparent)' : 'var(--adm-border)',
      }}
    >
      {/* Cover */}
      {cover && (
        <div className="relative w-full aspect-square overflow-hidden bg-black/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {a.cover_video_url && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <PlayCircle size={48} weight="fill" className="text-white/90 drop-shadow-lg" />
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col gap-2 p-5">
        {/* Title row */}
        <div className="flex items-start gap-2">
          {a.pinned && <PushPin size={13} weight="fill" className="text-[#DC5B17] shrink-0 mt-0.5" />}
          <h2 className="font-bold text-sm leading-snug flex-1" style={{ color: 'var(--adm-text)' }}>
            {a.title}
          </h2>
        </div>

        {/* Excerpt */}
        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--adm-muted)' }}>
          {stripHtml(a.body)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px]" style={{ color: 'var(--adm-muted)' }}>
            {formatDate(a.created_at)}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#DC5B17] opacity-0 group-hover:opacity-100 transition-opacity">
            Read more <ArrowRight size={11} weight="bold" />
          </span>
        </div>
      </div>
    </Link>
  );
}
