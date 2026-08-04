import type { Metadata } from 'next';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { categoryLabel } from '@/lib/categories';
import { BlogIndexClient } from '@/components/blog/BlogIndexClient';
import { LogoMark } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Blog — Nnamdi Obi',
  description: 'Writing on building in public, entrepreneurship, and tech from Nnamdi Obi.',
};

async function getPosts() {
  const admin = createAdminClient();
  const { data } = await admin
    .from('posts')
    .select('id, title, slug, subtitle, cover_image_url, category, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function BlogIndexPage() {
  const posts = await getPosts();

  const categories = Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => !!c)))
    .map((id) => ({ id, label: categoryLabel(id) ?? id }));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 flex justify-center px-4 sm:px-6 pt-4">
        <div className="flex items-center gap-8 rounded-full bg-black border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] pl-5 pr-2 py-2">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <LogoMark size={26} />
            <span className="text-white font-semibold text-sm">Nnamdi Obi</span>
          </Link>
          <Link href="/signup" className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors">
            Join now
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Blog</h1>
          <p className="text-[#666] text-lg">Writing on building in public, entrepreneurship, and tech.</p>
        </div>

        <BlogIndexClient posts={posts} categories={categories} />
      </main>
    </div>
  );
}
