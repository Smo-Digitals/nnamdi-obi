'use client';

import { useState } from 'react';
import { MagnifyingGlass } from 'phosphor-react';

interface Props {
  title:      string;
  excerpt:    string;
  body:       string;
  coverUrl:   string | null;
  slug:       string;
  seoKeyword: string;
  metaTitle:  string;
  metaDesc:   string;
}

function seoScore(p: Props) {
  let score = 0;
  const mt  = p.metaTitle  || p.title;
  const md  = p.metaDesc   || p.excerpt;
  const kw  = p.seoKeyword.toLowerCase();
  const wc  = p.body.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;

  if (p.title)                                 score += 15;
  if (p.excerpt)                               score += 10;
  if (kw)                                      score += 10;
  if (kw && mt.toLowerCase().includes(kw))     score += 20;
  if (kw && md.toLowerCase().includes(kw))     score += 10;
  if (mt.length >= 10 && mt.length <= 60)      score += 15;
  if (md.length >= 50 && md.length <= 160)     score += 10;
  if (wc >= 300)                               score += 10;
  return Math.min(score, 100);
}

function scoreColor(s: number) {
  if (s >= 70) return '#22c55e';
  if (s >= 40) return '#eab308';
  return '#f43f5e';
}

function scoreLabel(s: number) {
  if (s >= 70) return 'Good';
  if (s >= 40) return 'OK';
  return 'Poor';
}

export function PostPreviewPanel(p: Props) {
  const [tab, setTab] = useState<'post' | 'seo'>('post');
  const score = seoScore(p);
  const color = scoreColor(score);
  const mt    = p.metaTitle || p.title || 'Post title will appear here…';
  const md    = p.metaDesc  || p.excerpt || 'Your content will appear here as you write…';
  const displaySlug = p.slug || 'post-url-slug';

  return (
    <div className="flex-1 flex flex-col overflow-hidden border-l" style={{ borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-sidebar)' }}>

      {/* Tab bar */}
      <div className="shrink-0 flex items-center gap-1 px-4 py-3 border-b" style={{ borderColor: 'var(--adm-border)' }}>
        <div className="flex gap-1 p-1 rounded-xl flex-1" style={{ backgroundColor: 'var(--adm-card)' }}>
          {(['post', 'seo'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${tab === t ? 'bg-[#DC5B17] text-white' : ''}`}
              style={tab !== t ? { color: 'var(--adm-muted)' } : {}}>
              {t === 'post' ? 'Post Preview' : 'SEO Preview'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-2 shrink-0">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[10px] font-bold" style={{ color }}>{score}% {scoreLabel(score)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'post' ? (

          /* ── Post preview card ── */
          <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
            {/* Cover */}
            <div className="w-full aspect-video flex items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
              {p.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverUrl} alt="cover" className="w-full h-full object-cover" />
              ) : (
                <svg width="28" height="28" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
                </svg>
              )}
            </div>

            <div className="p-5">
              {/* Meta */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-[#DC5B17] flex items-center justify-center shrink-0">
                  <span className="text-white text-[8px] font-bold">N</span>
                </div>
                <span className="text-[11px] font-semibold text-[#111]">Nnamdi Obi</span>
                <span className="text-[#ccc] text-[10px]">·</span>
                <span className="text-[10px] text-[#888]">
                  {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-bold text-base leading-snug text-[#111] mb-2">
                {p.title || <span className="text-[#bbb]">Post title will appear here…</span>}
              </h2>

              {/* Excerpt */}
              <p className="text-sm leading-relaxed text-[#666] line-clamp-3">
                {p.excerpt || <span className="text-[#bbb]">Your content will appear here as you write…</span>}
              </p>
            </div>
          </div>

        ) : (

          /* ── SEO preview ── */
          <div className="flex flex-col gap-4">

            {/* Score ring */}
            <div className="flex flex-col items-center py-4">
              <div className="relative w-20 h-20 mb-2">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--adm-border)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
                    strokeDasharray={`${score} 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold" style={{ color }}>{score}</span>
                  <span className="text-[9px]" style={{ color: 'var(--adm-muted)' }}>/ 100</span>
                </div>
              </div>
              <span className="text-xs font-semibold" style={{ color }}>{scoreLabel(score)}</span>
            </div>

            {/* Google snippet */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}>
              <p className="text-[10px] mb-2 font-semibold text-[#888]">Search result preview</p>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-4 h-4 rounded-full bg-[#DC5B17] flex items-center justify-center shrink-0">
                  <span className="text-white text-[6px] font-bold">N</span>
                </div>
                <span className="text-[11px] text-[#202124]">nnamdiobi.com</span>
                <span className="text-[11px] text-[#5f6368]">› {displaySlug}</span>
              </div>
              <p className="text-sm text-[#1a0dab] font-medium leading-snug mb-1 line-clamp-2">{mt}</p>
              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">{md}</p>
            </div>

            {/* Checklist */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
              {[
                { label: 'Post title set',                    ok: !!p.title },
                { label: 'Excerpt / meta description added',  ok: !!p.excerpt },
                { label: 'Focus keyword set',                 ok: !!p.seoKeyword },
                { label: 'Keyword in meta title',             ok: !!p.seoKeyword && mt.toLowerCase().includes(p.seoKeyword.toLowerCase()) },
                { label: 'Keyword in meta description',       ok: !!p.seoKeyword && md.toLowerCase().includes(p.seoKeyword.toLowerCase()) },
                { label: 'Meta title length (10–60 chars)',   ok: mt.length >= 10 && mt.length <= 60 },
                { label: 'Meta description (50–160 chars)',   ok: md.length >= 50 && md.length <= 160 },
              ].map(({ label, ok }, i) => (
                <div key={label} className="flex items-center gap-2.5 px-3 py-2.5 text-xs"
                  style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined, color: 'var(--adm-text)' }}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${ok ? 'bg-green-500/15 text-green-500' : 'bg-red-500/10 text-red-400'}`}>
                    {ok ? '✓' : '✗'}
                  </span>
                  {label}
                </div>
              ))}
            </div>

            {/* Keyword */}
            {p.seoKeyword && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)', color: 'var(--adm-muted)' }}>
                <MagnifyingGlass size={12} /> Focus: <span style={{ color: 'var(--adm-text)' }}>{p.seoKeyword}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
