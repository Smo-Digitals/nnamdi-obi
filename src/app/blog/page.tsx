import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { BlogIndexClient } from '@/components/blog/BlogIndexClient';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Blog — Nnamdi Obi',
  description: 'Writing on building in public, entrepreneurship, and tech from Nnamdi Obi.',
};

async function getPosts() {
  const admin = createAdminClient();
  const { data } = await admin
    .from('posts')
    .select('id, title, slug, subtitle, cover_image_url, category, created_at, read_time_minutes, access, views')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Blog</h1>
          <p className="text-[#666] text-lg">Writing on building in public, entrepreneurship, and tech.</p>
        </div>

        <BlogIndexClient posts={posts} />
      </main>
    </div>
  );
}
