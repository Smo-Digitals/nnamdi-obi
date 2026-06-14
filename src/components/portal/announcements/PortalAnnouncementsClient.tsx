'use client';

import Link from 'next/link';
import { PushPin, ArrowRight, MegaphoneSimple, PlayCircle } from 'phosphor-react';

type Announcement = {
  id:              string;
  title:           string;
  body:            string;
  pinned:          boolean;
  created_at:      string;
  cover_image_url: string | null;
  cover_video_url: string | null;
};

interface Props { announcements: Announcement[] }

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function getYoutubeThumbnail(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

function AnnouncementCard({ a }: { a: Announcement }) {
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
        <div className="relative w-full h-44 overflow-hidden bg-black/20">
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
            {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#DC5B17] opacity-0 group-hover:opacity-100 transition-opacity">
            Read more <ArrowRight size={11} weight="bold" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PortalAnnouncementsClient({ announcements }: Props) {
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
      <div className="mb-8">
        <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>Announcements</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--adm-muted)' }}>
          {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
        </p>
      </div>

      {pinned.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--adm-muted)' }}>Pinned</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pinned.map((a) => <AnnouncementCard key={a.id} a={a} />)}
          </div>
        </div>
      )}

      {unpinned.length > 0 && (
        <div>
          {pinned.length > 0 && (
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--adm-muted)' }}>Latest</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {unpinned.map((a) => <AnnouncementCard key={a.id} a={a} />)}
          </div>
        </div>
      )}
    </div>
  );
}
