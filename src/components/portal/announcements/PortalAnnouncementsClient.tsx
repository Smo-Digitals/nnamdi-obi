'use client';

import { PushPin, MegaphoneSimple } from 'phosphor-react';

type Announcement = {
  id:           string;
  title:        string;
  body:         string;
  pinned:       boolean;
  created_at:   string;
};

interface Props { announcements: Announcement[] }

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
  const ordered  = [...pinned, ...unpinned];

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>Announcements</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--adm-muted)' }}>
          {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {ordered.map((a) => (
          <article
            key={a.id}
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: a.pinned ? 'color-mix(in srgb, #DC5B17 6%, var(--adm-card))' : 'var(--adm-card)',
              borderColor:     a.pinned ? 'color-mix(in srgb, #DC5B17 25%, transparent)' : 'var(--adm-border)',
            }}
          >
            {/* Title row */}
            <div className="flex items-start gap-3 mb-4">
              {a.pinned && (
                <PushPin size={15} weight="fill" className="text-[#DC5B17] shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-base leading-snug" style={{ color: 'var(--adm-text)' }}>
                  {a.title}
                </h2>
                <p className="text-xs mt-1" style={{ color: 'var(--adm-muted)' }}>
                  {new Date(a.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Body — rendered rich text */}
            <div
              className="prose prose-sm prose-invert max-w-none
                prose-p:text-[#aaa] prose-p:leading-relaxed
                prose-strong:text-white prose-strong:font-semibold
                prose-a:text-[#DC5B17] prose-a:no-underline hover:prose-a:underline
                prose-ul:text-[#aaa] prose-ol:text-[#aaa]
                prose-headings:text-white prose-headings:font-bold
                prose-blockquote:border-[#DC5B17] prose-blockquote:text-[#888]"
              dangerouslySetInnerHTML={{ __html: a.body }}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
