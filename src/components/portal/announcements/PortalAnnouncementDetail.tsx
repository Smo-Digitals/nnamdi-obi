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

export function PortalAnnouncementDetail({ announcement: a }: Props) {
  const embedUrl = a.cover_video_url ? getYoutubeEmbedUrl(a.cover_video_url) : null;

  return (
    <div className="p-8 max-w-2xl">
      {/* Back */}
      <Link href="/home/announcements"
        className="inline-flex items-center gap-1.5 text-xs font-semibold mb-8 transition-colors"
        style={{ color: 'var(--adm-muted)' }}>
        <ArrowLeft size={13} weight="bold" />
        All Announcements
      </Link>

      {/* Cover video */}
      {embedUrl && (
        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 bg-black">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Cover image (only if no video) */}
      {!embedUrl && a.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={a.cover_image_url}
          alt={a.title}
          className="w-full h-56 object-cover rounded-2xl mb-6"
        />
      )}

      {/* Header */}
      <div className="mb-6">
        {a.pinned && (
          <div className="flex items-center gap-1.5 text-[#DC5B17] text-xs font-semibold mb-2">
            <PushPin size={12} weight="fill" />
            Pinned
          </div>
        )}
        <h1 className="font-bold text-2xl leading-snug mb-2" style={{ color: 'var(--adm-text)' }}>
          {a.title}
        </h1>
        <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>
          {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <hr style={{ borderColor: 'var(--adm-border)' }} className="mb-6" />

      {/* Body */}
      <div
        className="prose prose-sm prose-invert max-w-none
          prose-p:text-[#aaa] prose-p:leading-relaxed
          prose-strong:text-white prose-strong:font-semibold
          prose-a:text-[#DC5B17] prose-a:no-underline hover:prose-a:underline
          prose-ul:text-[#aaa] prose-ol:text-[#aaa]
          prose-headings:text-white prose-headings:font-bold
          prose-blockquote:border-[#DC5B17] prose-blockquote:text-[#888]
          prose-iframe:w-full prose-iframe:aspect-video prose-iframe:rounded-xl"
        dangerouslySetInnerHTML={{ __html: a.body }}
      />
    </div>
  );
}
