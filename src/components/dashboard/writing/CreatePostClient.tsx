'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FloppyDisk, PaperPlaneTilt } from 'phosphor-react';
import { PostEditorPanel, type PostStatus } from './PostEditorPanel';
import { PostPreviewPanel } from './PostPreviewPanel';

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function CreatePostClient() {
  const [title,       setTitle]       = useState('');
  const [excerpt,     setExcerpt]     = useState('');
  const [body,        setBody]        = useState('');
  const [coverUrl,    setCoverUrl]    = useState<string | null>(null);
  const [slug,        setSlug]        = useState('');
  const [status,      setStatus]      = useState<PostStatus>('draft');
  const [categories,  setCategories]  = useState<string[]>([]);
  const [seoKeyword,  setSeoKeyword]  = useState('');
  const [metaTitle,   setMetaTitle]   = useState('');
  const [metaDesc,    setMetaDesc]    = useState('');
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);

  // Auto-generate slug from title when slug is still untouched
  useEffect(() => {
    setSlug((prev) => (prev === '' || prev === toSlug(title.slice(0, -1))) ? toSlug(title) : prev);
  }, [title]);

  const wordCount = body.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
  const readMins  = Math.max(1, Math.ceil(wordCount / 200));

  async function save(s: PostStatus) {
    if (!title.trim()) return;
    setSaving(true);
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, subtitle: excerpt, body, cover_image_url: coverUrl,
        slug, category: categories[0] ?? '', categories, tags: [],
        access: 'Free', seo_keyword: seoKeyword,
        meta_title: metaTitle, meta_description: metaDesc, status: s,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Top bar */}
      <div className="shrink-0 flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-card)' }}>
        <Link href="/admin/writing/posts"
          className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-70"
          style={{ color: 'var(--adm-muted)' }}>
          <ArrowLeft size={12} weight="bold" /> All Posts
        </Link>

        <span style={{ color: 'var(--adm-border)' }}>|</span>

        <span className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>
          {title.trim() || 'New Blog Post'}
        </span>

        <div className="flex-1" />

        {wordCount > 0 && (
          <span className="text-xs hidden sm:block" style={{ color: 'var(--adm-muted)' }}>
            {wordCount} words · {readMins} min read
          </span>
        )}

        <button onClick={() => save('draft')} disabled={!title.trim() || saving}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-white/5 disabled:opacity-40"
          style={{ color: 'var(--adm-muted)', borderColor: 'var(--adm-border)' }}>
          <FloppyDisk size={13} weight="bold" />
          {saved ? 'Saved!' : 'Save Draft'}
        </button>

        <button onClick={() => save('published')} disabled={!title.trim() || saving}
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg bg-[#DC5B17] text-white hover:bg-[#c44f13] transition-colors disabled:opacity-40">
          <PaperPlaneTilt size={13} weight="bold" />
          {status === 'published' ? 'Publish' : 'Save'}
        </button>
      </div>

      {/* Two-panel body — equal 50/50 split */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        <div className="w-1/2 flex flex-col overflow-hidden">
          <PostEditorPanel
            title={title}       setTitle={setTitle}
            excerpt={excerpt}   setExcerpt={setExcerpt}
            body={body}         setBody={setBody}
            coverUrl={coverUrl} setCoverUrl={setCoverUrl}
            slug={slug}         setSlug={setSlug}
            status={status}     setStatus={setStatus}
            categories={categories} setCategories={setCategories}
            seoKeyword={seoKeyword} setSeoKeyword={setSeoKeyword}
            metaTitle={metaTitle}   setMetaTitle={setMetaTitle}
            metaDesc={metaDesc}     setMetaDesc={setMetaDesc}
          />
        </div>
        <div className="w-1/2 flex flex-col overflow-hidden">
          <PostPreviewPanel
            title={title} excerpt={excerpt} body={body}
            coverUrl={coverUrl} slug={slug}
            seoKeyword={seoKeyword} metaTitle={metaTitle} metaDesc={metaDesc}
          />
        </div>
      </div>
    </div>
  );
}
