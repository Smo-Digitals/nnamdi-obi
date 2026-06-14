'use client';

import Link from 'next/link';
import { ArrowLeft, PushPin } from 'phosphor-react';

type Announcement = {
  id:              string;
  title:           string;
  body:            string;
  pinned:          boolean;
  created_at:      string;
  cover_image_url: string | null;
  cover_video_url: string | null;
};

interface Props { announcement: Announcement }

function getYoutubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

// Prose vars that inherit from the active theme — works in both light and dark mode
const proseStyle = {
  '--tw-prose-body':          'var(--adm-muted)',
  '--tw-prose-headings':      'var(--adm-text)',
  '--tw-prose-bold':          'var(--adm-text)',
  '--tw-prose-links':         '#DC5B17',
  '--tw-prose-bullets':       'var(--adm-muted)',
  '--tw-prose-counters':      'var(--adm-muted)',
  '--tw-prose-quotes':        'var(--adm-muted)',
  '--tw-prose-quote-borders': '#DC5B17',
  '--tw-prose-hr':            'var(--adm-border)',
  '--tw-prose-code':          'var(--adm-text)',
  '--tw-prose-th-borders':    'var(--adm-border)',
  '--tw-prose-td-borders':    'var(--adm-border)',
} as React.CSSProperties;

const proseClass = 'prose prose-sm max-w-none prose-headings:font-bold prose-a:no-underline hover:prose-a:underline prose-blockquote:border-[#DC5B17] prose-iframe:w-full prose-iframe:aspect-video prose-iframe:rounded-xl';

export function PortalAnnouncementDetail({ announcement: a }: Props) {
  const embedUrl = a.cover_video_url ? getYoutubeEmbedUrl(a.cover_video_url) : null;
  const hasCover = !!embedUrl || !!a.cover_image_url;

  if (!hasCover) {
    return (
      <div className="p-8 max-w-2xl">
        <Link href="/home/announcements"
          className="inline-flex items-center gap-1.5 text-xs font-semibold mb-8 transition-colors"
          style={{ color: 'var(--adm-muted)' }}>
          <ArrowLeft size={13} weight="bold" /> All Announcements
        </Link>
        <h1 className="font-bold text-2xl leading-snug mb-2" style={{ color: 'var(--adm-text)' }}>{a.title}</h1>
        <p className="text-xs mb-6" style={{ color: 'var(--adm-muted)' }}>
          {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <hr style={{ borderColor: 'var(--adm-border)' }} className="mb-6" />
        <div className={proseClass} style={proseStyle} dangerouslySetInnerHTML={{ __html: a.body }} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Back button — fixed at top */}
      <div className="shrink-0 px-8 pt-8 pb-4">
        <Link href="/home/announcements"
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
          style={{ color: 'var(--adm-muted)' }}>
          <ArrowLeft size={13} weight="bold" /> All Announcements
        </Link>
      </div>

      {/* Two-panel: left image fixed, right content scrolls */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* LEFT — square image, never scrolls */}
        <div className="w-[380px] shrink-0 px-8 pb-8">
          {embedUrl ? (
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-black">
              <iframe src={embedUrl} className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={a.cover_image_url!} alt={a.title}
              className="w-full aspect-square object-cover rounded-2xl" />
          )}
        </div>

        {/* RIGHT — scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 min-w-0">
          {a.pinned && (
            <div className="flex items-center gap-1.5 text-[#DC5B17] text-xs font-semibold mb-3">
              <PushPin size={12} weight="fill" /> Pinned
            </div>
          )}
          <h1 className="font-bold text-2xl leading-snug mb-2" style={{ color: 'var(--adm-text)' }}>
            {a.title}
          </h1>
          <p className="text-xs mb-6" style={{ color: 'var(--adm-muted)' }}>
            {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <hr style={{ borderColor: 'var(--adm-border)' }} className="mb-6" />
          <div className={proseClass} style={proseStyle} dangerouslySetInnerHTML={{ __html: a.body }} />
        </div>
      </div>
    </div>
  );
}
