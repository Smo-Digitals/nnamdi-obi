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
  const hasCover = !!embedUrl || !!a.cover_image_url;

  return (
    <div className="min-h-full flex flex-col p-8">
      {/* Back */}
      <Link href="/home/announcements"
        className="inline-flex items-center gap-1.5 text-xs font-semibold mb-10 transition-colors"
        style={{ color: 'var(--adm-muted)' }}>
        <ArrowLeft size={13} weight="bold" />
        All Announcements
      </Link>

      {/* Main layout — aligned with back button, side by side when cover exists */}
      <div className="flex-1">
        <div className={`flex gap-10 ${hasCover ? 'flex-col lg:flex-row' : 'flex-col max-w-2xl'}`}>

          {/* LEFT — cover media */}
          {hasCover && (
            <div className="lg:w-[420px] shrink-0">
              {embedUrl ? (
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black sticky top-8">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={a.cover_image_url!}
                  alt={a.title}
                  className="w-full rounded-2xl object-cover sticky top-8"
                  style={{ maxHeight: '560px' }}
                />
              )}
            </div>
          )}

          {/* RIGHT — content */}
          <div className="flex-1 min-w-0">
            {a.pinned && (
              <div className="flex items-center gap-1.5 text-[#DC5B17] text-xs font-semibold mb-3">
                <PushPin size={12} weight="fill" />
                Pinned
              </div>
            )}
            <h1 className="font-bold text-2xl leading-snug mb-2" style={{ color: 'var(--adm-text)' }}>
              {a.title}
            </h1>
            <p className="text-xs mb-6" style={{ color: 'var(--adm-muted)' }}>
              {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <hr style={{ borderColor: 'var(--adm-border)' }} className="mb-6" />

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
        </div>
      </div>
    </div>
  );
}
