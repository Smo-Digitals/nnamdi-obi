'use client';

import { useRef, useEffect } from 'react';
import { RichTextEditor } from '@/components/dashboard/RichTextEditor';
import { Image as ImageIcon } from 'phosphor-react';

export type PostStatus = 'draft' | 'scheduled' | 'published';

const CATEGORIES = [
  { id: 'community',        label: 'Community',        children: [] },
  { id: 'building-public',  label: 'Building in Public', children: [
    { id: 'founder-diaries',  label: 'Founder Diaries' },
    { id: 'product-updates',  label: 'Product Updates' },
  ]},
  { id: 'entrepreneurship', label: 'Entrepreneurship', children: [] },
  { id: 'courses',          label: 'Courses',          children: [
    { id: 'course-reviews', label: 'Course Reviews' },
    { id: 'learning-tips',  label: 'Learning Tips' },
  ]},
  { id: 'tech',             label: 'Tech',             children: [
    { id: 'web-dev',        label: 'Web Development' },
    { id: 'tools',          label: 'Tools & Resources' },
  ]},
  { id: 'marketing',        label: 'Marketing',        children: [] },
  { id: 'personal',         label: 'Personal',         children: [] },
  { id: 'finance',          label: 'Finance',          children: [] },
  { id: 'productivity',     label: 'Productivity',     children: [] },
  { id: 'industry',         label: 'Industry',         children: [] },
];

const STATUS_OPTIONS = [
  { value: 'draft',     label: 'Draft',     desc: 'Saved privately, not visible on site',  icon: '✏️' },
  { value: 'scheduled', label: 'Scheduled', desc: 'Will publish at a set date and time',   icon: '📅' },
  { value: 'published', label: 'Publish',   desc: 'Visible to all readers immediately',    icon: '🚀' },
] as const;

function AutoTextarea({ value, onChange, placeholder, className, style, minRows = 1 }: {
  value: string; onChange: (v: string) => void;
  placeholder: string; className?: string; style?: React.CSSProperties; minRows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = 'auto';
    ref.current.style.height = ref.current.scrollHeight + 'px';
  }, [value]);
  return (
    <textarea ref={ref} value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} rows={minRows}
      className={`w-full bg-transparent resize-none outline-none placeholder:opacity-50 leading-tight ${className ?? ''}`}
      style={style} />
  );
}

interface Props {
  title: string; setTitle: (v: string) => void;
  excerpt: string; setExcerpt: (v: string) => void;
  body: string; setBody: (v: string) => void;
  coverUrl: string | null; setCoverUrl: (v: string | null) => void;
  slug: string; setSlug: (v: string) => void;
  status: PostStatus; setStatus: (v: PostStatus) => void;
  categories: string[]; setCategories: (v: string[]) => void;
  seoKeyword: string; setSeoKeyword: (v: string) => void;
  metaTitle: string; setMetaTitle: (v: string) => void;
  metaDesc: string; setMetaDesc: (v: string) => void;
}

export function PostEditorPanel(p: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function onCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const form = new FormData(); form.append('file', file); form.append('folder', 'posts');
    const res = await fetch('/api/upload-image', { method: 'POST', body: form });
    if (res.ok) { const { url } = await res.json(); p.setCoverUrl(url); }
  }

  function toggleCat(id: string) {
    p.setCategories(p.categories.includes(id) ? p.categories.filter((c) => c !== id) : [...p.categories, id]);
  }

  const sDesc = STATUS_OPTIONS.find((s) => s.value === p.status)?.desc ?? '';

  return (
    <div className="w-full flex-1 flex flex-col overflow-hidden">

      {/* Sticky title + excerpt — always visible while scrolling */}
      <div className="shrink-0 border-b px-8 py-6" style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)' }}>
        <div className="max-w-2xl mx-auto">
          <AutoTextarea value={p.title} onChange={p.setTitle} placeholder="Post title…"
            className="font-bold text-3xl mb-2" style={{ color: 'var(--adm-text)' }} />
          <AutoTextarea value={p.excerpt} onChange={p.setExcerpt} placeholder="Excerpt — a short description of the post"
            className="text-base" style={{ color: 'var(--adm-muted)' }} />
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-8 py-8 flex flex-col gap-0">

        {/* Rich text */}
        <div className="rounded-2xl border mb-8" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <div className="border-b" style={{ borderColor: 'var(--adm-border)' }}>
            <RichTextEditor value={p.body} onChange={p.setBody} />
          </div>
        </div>

        {/* Cover image */}
        <div className="rounded-2xl border mb-5 overflow-hidden" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--adm-border)' }}>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--adm-muted)' }}>Cover Image</span>
            <span className="text-[10px]" style={{ color: 'var(--adm-muted)' }}>16:9 · PNG, JPG, WEBP</span>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onCoverFile} />
          {p.coverUrl ? (
            <div className="relative w-full aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.coverUrl} alt="cover" className="w-full h-full object-cover" />
              <button onClick={() => p.setCoverUrl(null)}
                className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/50 text-white text-xs hover:bg-black/70">Remove</button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()}
              className="w-full aspect-video flex flex-col items-center justify-center gap-2 hover:opacity-70 transition-opacity"
              style={{ backgroundColor: 'var(--adm-bg)' }}>
              <ImageIcon size={24} style={{ color: 'var(--adm-muted)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--adm-muted)' }}>Click or drag to upload</span>
              <span className="text-xs" style={{ color: 'var(--adm-muted)' }}>PNG, JPG, WEBP, AVIF · 1280 × 720 recommended</span>
            </button>
          )}
        </div>

        {/* Slug + Status */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--adm-muted)' }}>URL Slug</label>
            <input value={p.slug} onChange={(e) => p.setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
              placeholder="post-url-slug" className="w-full bg-transparent text-sm outline-none"
              style={{ color: 'var(--adm-text)' }} />
          </div>
          <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--adm-muted)' }}>Status</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map(({ value, label, icon }) => (
                <button key={value} onClick={() => p.setStatus(value as PostStatus)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-semibold border transition-colors ${
                    p.status === value ? 'bg-[#DC5B17]/10 border-[#DC5B17]/30 text-[#DC5B17]' : 'border-transparent hover:bg-white/5'
                  }`} style={p.status !== value ? { color: 'var(--adm-muted)' } : {}}>
                  <span className="text-base">{icon}</span>{label}
                </button>
              ))}
            </div>
            <p className="text-[10px] mt-2 text-center" style={{ color: 'var(--adm-muted)' }}>{sDesc}</p>
          </div>
        </div>

        {/* Categories */}
        <div className="rounded-2xl border mb-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--adm-border)' }}>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--adm-muted)' }}>Categories</span>
          </div>
          <div className="p-2">
            {CATEGORIES.map(({ id, label, children }) => (
              <div key={id}>
                <label className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                  <input type="checkbox" checked={p.categories.includes(id)} onChange={() => toggleCat(id)}
                    className="accent-[#DC5B17] w-3.5 h-3.5" />
                  <span className="text-sm" style={{ color: 'var(--adm-text)' }}>{label}</span>
                </label>
                {children.map((ch) => (
                  <label key={ch.id} className="flex items-center gap-3 pl-8 pr-2 py-1.5 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC5B17]/40 shrink-0" />
                    <span className="text-xs" style={{ color: 'var(--adm-muted)' }}>{ch.label}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-2xl border mb-10" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--adm-border)' }}>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--adm-muted)' }}>SEO</span>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--adm-muted)' }}>Focus Keyword</label>
              <input value={p.seoKeyword} onChange={(e) => p.setSeoKeyword(e.target.value)}
                placeholder="e.g. build in public" className="w-full text-sm px-3 py-2 rounded-xl border outline-none"
                style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }} />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>Meta Title</label>
                <span className="text-[10px]" style={{ color: p.metaTitle.length > 60 ? '#f43f5e' : 'var(--adm-muted)' }}>{p.metaTitle.length}/60</span>
              </div>
              <input value={p.metaTitle} onChange={(e) => p.setMetaTitle(e.target.value)}
                placeholder="Defaults to post title" className="w-full text-sm px-3 py-2 rounded-xl border outline-none"
                style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }} />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>Meta Description</label>
                <span className="text-[10px]" style={{ color: p.metaDesc.length > 160 ? '#f43f5e' : 'var(--adm-muted)' }}>{p.metaDesc.length}/160</span>
              </div>
              <textarea value={p.metaDesc} onChange={(e) => p.setMetaDesc(e.target.value)}
                placeholder="Defaults to excerpt" rows={3}
                className="w-full text-sm px-3 py-2 rounded-xl border outline-none resize-none"
                style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }} />
            </div>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}
