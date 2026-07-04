import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata: Metadata = {
  title: 'Blog — Nnamdi Obi',
  description: 'Writing on building in public, entrepreneurship, and tech from Nnamdi Obi.',
};

function categoryLabel(id: string | null) {
  if (!id) return null;
  return id.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#DC5B17] flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="text-white font-semibold text-sm">Nnamdi Obi</span>
          </Link>
          <Link href="/signup" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">
            Join now
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Blog</h1>
          <p className="text-[#666] text-lg">Writing on building in public, entrepreneurship, and tech.</p>
        </div>

        {posts.length === 0 ? (
          <div className="py-24 text-center text-[#666]">No posts published yet — check back soon.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 bg-white/5">
                  {post.cover_image_url ? (
                    <Image src={post.cover_image_url} alt={post.title} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-lg bg-[#DC5B17]/20 flex items-center justify-center">
                        <span className="text-[#DC5B17] text-sm font-bold">N</span>
                      </div>
                    </div>
                  )}
                </div>

                {categoryLabel(post.category) && (
                  <span className="text-[11px] font-semibold text-[#DC5B17] uppercase tracking-wide mb-2">
                    {categoryLabel(post.category)}
                  </span>
                )}

                <h2 className="text-lg font-bold leading-snug mb-2 group-hover:text-[#DC5B17] transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {post.subtitle && (
                  <p className="text-sm text-[#666] leading-relaxed mb-3 line-clamp-2">{post.subtitle}</p>
                )}

                <span className="text-xs text-[#555] mt-auto">
                  {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
