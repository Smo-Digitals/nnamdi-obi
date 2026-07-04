import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

async function getPost(slug: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from('posts')
    .select('id, title, subtitle, body, cover_image_url, seo_keyword, meta_title, meta_description, created_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.subtitle || undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.subtitle || undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const admin = createAdminClient();
  admin.rpc('increment_post_views', { post_id: post.id }).then(() => {});

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white transition-colors">
            <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></svg>
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-7 h-7 rounded-full bg-[#DC5B17] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span className="text-sm font-semibold">Nnamdi Obi</span>
          <span className="text-white/30">·</span>
          <span className="text-sm text-white/50">
            {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{post.title}</h1>

        {post.subtitle && (
          <p className="text-lg text-white/60 leading-relaxed mb-8 pb-8 border-b border-white/10">{post.subtitle}</p>
        )}

        {post.cover_image_url && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10">
            <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <div
          className="prose prose-invert max-w-none
            prose-headings:font-bold prose-a:text-[#DC5B17] prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-2xl prose-blockquote:border-l-[#DC5B17] prose-blockquote:not-italic"
          dangerouslySetInnerHTML={{ __html: post.body ?? '' }}
        />
      </main>
    </div>
  );
}
