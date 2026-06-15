'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type CuratedLink = {
  id: string; url: string; title: string; description: string | null;
  image_url: string | null; source_name: string | null; author: string | null;
  position: number; added_at: string;
};

function ExternalIcon() {
  return (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

export function CuratedReadsPage() {
  const [links,   setLinks]   = useState<CuratedLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/curated')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setLinks(d); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DC5B17]" />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#DC5B17' }}>Curated</span>
        </div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--adm-text)' }}>Reads Worth Your Time</h1>
        <p className="text-sm mt-2 max-w-lg" style={{ color: 'var(--adm-muted)' }}>
          Hand-picked articles and posts from around the web — selected to help you think, learn, and grow.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border h-28 animate-pulse"
              style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }} />
          ))}
        </div>
      ) : links.length === 0 ? (
        <div className="rounded-2xl border py-20 text-center"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <p className="text-sm" style={{ color: 'var(--adm-muted)' }}>No curated reads yet — check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {links.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              className="group rounded-2xl border flex gap-0 overflow-hidden transition-all hover:border-[#DC5B17]/40"
              style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>

              {/* Thumbnail */}
              {link.image_url && (
                <div className="w-40 shrink-0 overflow-hidden bg-white/5">
                  <Image src={link.image_url} alt="" width={160} height={112}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" unoptimized />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                <div>
                  {link.source_name && (
                    <p className="text-xs font-semibold mb-1.5" style={{ color: '#DC5B17' }}>{link.source_name}</p>
                  )}
                  <p className="text-base font-semibold leading-snug group-hover:text-[#DC5B17] transition-colors line-clamp-2"
                    style={{ color: 'var(--adm-text)' }}>
                    {link.title}
                  </p>
                  {link.description && (
                    <p className="text-sm mt-1.5 line-clamp-2" style={{ color: 'var(--adm-muted)' }}>
                      {link.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    {link.author && (
                      <span className="text-xs" style={{ color: 'var(--adm-muted)' }}>By {link.author}</span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#DC5B17' }}>
                    Read article <ExternalIcon />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
