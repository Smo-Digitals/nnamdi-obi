'use client';

import { useEffect, useState } from 'react';
import { X } from 'phosphor-react';
import { PostPreviewPanel } from './PostPreviewPanel';

interface Props {
  postId: string | null;
  onClose: () => void;
}

type PostData = {
  title: string; subtitle: string; body: string; cover_image_url: string | null;
  slug: string; seo_keyword: string; meta_title: string; meta_description: string;
};

export function PostPreviewModal({ postId, onClose }: Props) {
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    setPost(null);
    fetch(`/api/posts/${postId}`)
      .then((r) => r.json())
      .then(setPost)
      .finally(() => setLoading(false));
  }, [postId]);

  if (!postId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl border flex flex-col overflow-hidden"
        style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)', maxHeight: '85vh' }}>

        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--adm-border)' }}>
          <h2 className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>Preview</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={14} style={{ color: 'var(--adm-muted)' }} />
          </button>
        </div>

        {loading || !post ? (
          <div className="py-20 text-center text-sm" style={{ color: 'var(--adm-muted)' }}>Loading…</div>
        ) : (
          <PostPreviewPanel
            title={post.title} excerpt={post.subtitle} body={post.body}
            coverUrl={post.cover_image_url} slug={post.slug}
            seoKeyword={post.seo_keyword} metaTitle={post.meta_title} metaDesc={post.meta_description}
          />
        )}
      </div>
    </div>
  );
}
