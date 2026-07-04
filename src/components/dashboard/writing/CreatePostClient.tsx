'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, FloppyDisk, PaperPlaneTilt, CheckCircle, WarningCircle, X } from 'phosphor-react';
import { PostEditorPanel, type PostStatus } from './PostEditorPanel';
import { PostPreviewPanel } from './PostPreviewPanel';

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

type Toast = { id: number; message: string; type: 'success' | 'error' };

function ToastStack({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium pointer-events-auto animate-in slide-in-from-bottom-4 fade-in duration-200"
          style={{
            backgroundColor: t.type === 'success' ? '#1a2e1a' : '#2e1a1a',
            border: `1px solid ${t.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: t.type === 'success' ? '#4ade80' : '#f87171',
          }}>
          {t.type === 'success'
            ? <CheckCircle size={16} weight="fill" />
            : <WarningCircle size={16} weight="fill" />}
          {t.message}
          <button onClick={() => onDismiss(t.id)} className="ml-1 opacity-60 hover:opacity-100 transition-opacity">
            <X size={13} weight="bold" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function CreatePostClient() {
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');

  const [title,      setTitle]      = useState('');
  const [excerpt,    setExcerpt]    = useState('');
  const [body,       setBody]       = useState('');
  const [coverUrl,   setCoverUrl]   = useState<string | null>(null);
  const [slug,       setSlug]       = useState('');
  const [status,     setStatus]     = useState<PostStatus>('draft');
  const [categories, setCategories] = useState<string[]>([]);
  const [seoKeyword, setSeoKeyword] = useState('');
  const [metaTitle,  setMetaTitle]  = useState('');
  const [metaDesc,   setMetaDesc]   = useState('');
  const [saving,     setSaving]     = useState(false);
  const [loading,    setLoading]    = useState(!!postId);
  const [toasts,     setToasts]     = useState<Toast[]>([]);
  let toastId = 0;

  useEffect(() => {
    setSlug((prev) => (prev === '' || prev === toSlug(title.slice(0, -1))) ? toSlug(title) : prev);
  }, [title]);

  useEffect(() => {
    if (!postId) return;
    (async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) { addToast('Could not load post.', 'error'); return; }
        const data = await res.json();
        setTitle(data.title ?? '');
        setExcerpt(data.subtitle ?? '');
        setBody(data.body ?? '');
        setCoverUrl(data.cover_image_url ?? null);
        setSlug(data.slug ?? '');
        setStatus((data.status as PostStatus) ?? 'draft');
        setCategories(data.categories ?? []);
        setSeoKeyword(data.seo_keyword ?? '');
        setMetaTitle(data.meta_title ?? '');
        setMetaDesc(data.meta_description ?? '');
      } catch {
        addToast('Network error — could not load post.', 'error');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  function addToast(message: string, type: Toast['type']) {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }
  function dismissToast(id: number) { setToasts((t) => t.filter((x) => x.id !== id)); }

  async function save(s: PostStatus) {
    if (!title.trim()) { addToast('Add a title before saving.', 'error'); return; }
    setSaving(true);
    try {
      const res = await fetch(postId ? `/api/posts/${postId}` : '/api/posts', {
        method: postId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, subtitle: excerpt, body, cover_image_url: coverUrl,
          slug, category: categories[0] ?? '', categories, tags: [],
          access: 'Free', seo_keyword: seoKeyword,
          meta_title: metaTitle, meta_description: metaDesc, status: s,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        addToast(err.error ?? 'Save failed. Check your database.', 'error');
      } else {
        addToast(s === 'published' ? '🚀 Post published!' : '✓ Draft saved', 'success');
      }
    } catch {
      addToast('Network error — could not save.', 'error');
    } finally {
      setSaving(false);
    }
  }

  const wordCount = body.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
  const readMins  = Math.max(1, Math.ceil(wordCount / 200));

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-sm" style={{ color: 'var(--adm-muted)' }}>
        Loading post…
      </div>
    );
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

        <button onClick={() => save('draft')} disabled={saving}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-white/5 disabled:opacity-40"
          style={{ color: 'var(--adm-muted)', borderColor: 'var(--adm-border)' }}>
          <FloppyDisk size={13} weight="bold" />
          {saving ? 'Saving…' : 'Save Draft'}
        </button>

        <button onClick={() => save('published')} disabled={saving}
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg bg-[#DC5B17] text-white hover:bg-[#c44f13] transition-colors disabled:opacity-40">
          <PaperPlaneTilt size={13} weight="bold" />
          {saving ? 'Saving…' : 'Publish'}
        </button>
      </div>

      {/* Two-panel body */}
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

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
