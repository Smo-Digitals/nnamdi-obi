'use client';

import { useState, useRef, useEffect } from 'react';
import { RichTextEditor } from '@/components/dashboard/RichTextEditor';
import { ImageUploader } from '@/components/dashboard/ImageUploader';
import { ArrowLeft, Eye, FloppyDisk, PaperPlaneTilt, X, Tag } from 'phosphor-react';
import Link from 'next/link';

const CATEGORIES = ['Community', 'Courses', 'Productivity', 'Personal', 'Marketing', 'Industry', 'Finance', 'Tech'];
const ACCESS     = ['Free', 'Members only', 'Paid'] as const;
type AccessLevel = typeof ACCESS[number];

function AutoTextarea({
  value, onChange, placeholder, className, style, minRows = 1,
}: {
  value: string; onChange: (v: string) => void;
  placeholder: string; className?: string; style?: React.CSSProperties; minRows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={minRows}
      className={`w-full bg-transparent resize-none outline-none placeholder:opacity-30 leading-tight ${className ?? ''}`}
      style={style}
    />
  );
}

export function CreatePostClient() {
  const [title,       setTitle]       = useState('');
  const [subtitle,    setSubtitle]    = useState('');
  const [body,        setBody]        = useState('');
  const [coverUrl,    setCoverUrl]    = useState<string | null>(null);
  const [category,    setCategory]    = useState('');
  const [tagInput,    setTagInput]    = useState('');
  const [tags,        setTags]        = useState<string[]>([]);
  const [access,      setAccess]      = useState<AccessLevel>('Free');
  const [saving,      setSaving]      = useState(false);

  function addTag(e: React.KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      setTags((t) => [...new Set([...t, tagInput.trim()])]);
      setTagInput('');
    }
  }
  function removeTag(tag: string) { setTags((t) => t.filter((x) => x !== tag)); }

  async function save(status: 'draft' | 'published') {
    setSaving(true);
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, subtitle, body, cover_image_url: coverUrl, category, tags, access, status }),
    });
    setSaving(false);
  }

  const wordCount = body.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
  const readMins  = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Top bar */}
      <div className="shrink-0 flex items-center gap-3 px-6 py-3 border-b" style={{ borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-card)' }}>
        <Link href="/admin/writing/posts"
          className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-70"
          style={{ color: 'var(--adm-muted)' }}>
          <ArrowLeft size={13} weight="bold" /> Posts
        </Link>

        <div className="flex-1" />

        {/* Word count */}
        <span className="text-xs hidden sm:block" style={{ color: 'var(--adm-muted)' }}>
          {wordCount} words · {readMins} min read
        </span>

        {/* Access */}
        <select value={access} onChange={(e) => setAccess(e.target.value as AccessLevel)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border outline-none cursor-pointer"
          style={{ backgroundColor: 'var(--adm-pill)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }}>
          {ACCESS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>

        <button onClick={() => save('draft')} disabled={saving}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-white/5"
          style={{ color: 'var(--adm-muted)', borderColor: 'var(--adm-border)' }}>
          <FloppyDisk size={13} weight="bold" /> Save draft
        </button>
        <button onClick={() => save('published')} disabled={!title.trim() || saving}
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg bg-[#DC5B17] text-white hover:bg-[#c44f13] transition-colors disabled:opacity-50">
          <PaperPlaneTilt size={13} weight="bold" /> Publish
        </button>
      </div>

      {/* Body — two panels */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* ── LEFT: Editor ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-10 flex flex-col gap-6">

            {/* Cover image */}
            <ImageUploader
              value={coverUrl}
              onChange={setCoverUrl}
              folder="posts"
              label="Cover image"
            />

            {/* Title */}
            <AutoTextarea
              value={title}
              onChange={setTitle}
              placeholder="Post title"
              className="font-bold text-4xl"
              style={{ color: 'var(--adm-text)' }}
            />

            {/* Subtitle */}
            <AutoTextarea
              value={subtitle}
              onChange={setSubtitle}
              placeholder="Add a subtitle..."
              className="text-lg"
              style={{ color: 'var(--adm-muted)' }}
            />

            <hr style={{ borderColor: 'var(--adm-border)' }} />

            {/* Rich text body */}
            <RichTextEditor value={body} onChange={setBody} />

            <div className="h-32" />
          </div>
        </div>

        {/* Divider */}
        <div className="w-px shrink-0" style={{ backgroundColor: 'var(--adm-border)' }} />

        {/* ── RIGHT: Settings + Preview ── */}
        <div className="w-80 shrink-0 flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--adm-sidebar)' }}>

          {/* Settings */}
          <div className="shrink-0 border-b px-5 py-5 flex flex-col gap-4" style={{ borderColor: 'var(--adm-border)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--adm-muted)' }}>Settings</p>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--adm-muted)' }}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border outline-none"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }}>
                <option value="">No category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--adm-muted)' }}>Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {tags.map((t) => (
                  <span key={t} className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#DC5B17]/15 text-[#DC5B17]">
                    {t}
                    <button onClick={() => removeTag(t)} className="hover:opacity-70"><X size={9} weight="bold" /></button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
                <Tag size={12} style={{ color: 'var(--adm-muted)' }} />
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="Add tag, press Enter"
                  className="flex-1 bg-transparent text-xs outline-none"
                  style={{ color: 'var(--adm-text)' }}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--adm-border)' }}>
              <Eye size={12} className="text-[#DC5B17]" />
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--adm-muted)' }}>Preview</p>
            </div>

            {/* Simulated reader view */}
            <div className="p-4">
              <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#fff', borderColor: 'var(--adm-border)' }}>
                {/* Pub header */}
                <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: '#e5e5e5' }}>
                  <div className="w-5 h-5 rounded-full bg-[#DC5B17] flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">N</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#111]">nnamdiobi.com</span>
                </div>

                {/* Cover */}
                {coverUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverUrl} alt="cover" className="w-full aspect-video object-cover" />
                )}

                <div className="p-4">
                  {/* Access badge */}
                  {access !== 'Free' && (
                    <span className="inline-block mb-2 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#DC5B17]/10 text-[#DC5B17]">
                      {access}
                    </span>
                  )}

                  {/* Title */}
                  <h1 className="font-bold text-sm leading-snug text-[#111] mb-1">
                    {title || <span className="opacity-30">Your title here…</span>}
                  </h1>

                  {/* Subtitle */}
                  {subtitle && <p className="text-xs text-[#555] mb-2 leading-relaxed">{subtitle}</p>}

                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 rounded-full bg-[#DC5B17] flex items-center justify-center">
                      <span className="text-white text-[7px] font-bold">N</span>
                    </div>
                    <span className="text-[10px] text-[#888]">Nnamdi Obi</span>
                    <span className="text-[10px] text-[#ccc]">·</span>
                    <span className="text-[10px] text-[#888]">
                      {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {wordCount > 0 && (
                      <>
                        <span className="text-[10px] text-[#ccc]">·</span>
                        <span className="text-[10px] text-[#888]">{readMins} min</span>
                      </>
                    )}
                  </div>

                  {/* Category tag */}
                  {category && (
                    <span className="inline-block mb-3 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#f3f3f3] text-[#555]">
                      {category}
                    </span>
                  )}

                  <hr className="border-[#f0f0f0] mb-3" />

                  {/* Body preview */}
                  <div
                    className="prose prose-xs max-w-none text-[#333] [&_h1]:text-sm [&_h2]:text-xs [&_h3]:text-xs [&_p]:text-[11px] [&_p]:leading-relaxed [&_a]:text-[#DC5B17]"
                    dangerouslySetInnerHTML={{ __html: body || '<p style="color:#bbb;font-size:11px">Your content will appear here as you write…</p>' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
