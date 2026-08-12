'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlass, Clock, Sparkle } from 'phosphor-react';
import { CATEGORIES, categoryLabel } from '@/lib/categories';
import { BlogCategorySidebar } from './BlogCategorySidebar';

type Post = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  cover_image_url: string | null;
  category: string | null;
  created_at: string;
  read_time_minutes: number | null;
  access: string;
  views: number;
};

type Sort = 'newest' | 'oldest' | 'popular';

const CHILD_TO_PARENT = new Map<string, string>(
  CATEGORIES.flatMap((c) => c.children.map((ch) => [ch.id, c.id] as const))
);

export function BlogIndexClient({ posts }: { posts: Post[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('newest');

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of posts) {
      if (!p.category) continue;
      map[p.category] = (map[p.category] ?? 0) + 1;
    }
    return map;
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = posts.filter((post) => {
      const matchesCategory =
        activeCategory === 'all' ||
        post.category === activeCategory ||
        CHILD_TO_PARENT.get(post.category ?? '') === activeCategory;
      const matchesQuery =
        !q || post.title.toLowerCase().includes(q) || (post.subtitle ?? '').toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });

    return [...result].sort((a, b) => {
      if (sort === 'popular') return b.views - a.views;
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sort === 'oldest' ? diff : -diff;
    });
  }, [posts, activeCategory, query, sort]);

  const activeLabel = activeCategory === 'all' ? 'All Posts' : categoryLabel(activeCategory) ?? activeCategory;

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Sidebar */}
      <aside className="lg:w-56 shrink-0">
        <div className="lg:sticky lg:top-28">
          <div className="hidden lg:block">
            <BlogCategorySidebar counts={counts} totalCount={posts.length} active={activeCategory} onSelect={setActiveCategory} />
          </div>

          {/* Mobile: horizontal pill scroller */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === 'all' ? 'bg-[#DC5B17] text-white' : 'bg-white/5 text-[#999]'
              }`}
            >
              All
            </button>
            {CATEGORIES.filter((c) => (counts[c.id] ?? 0) + c.children.reduce((s, ch) => s + (counts[ch.id] ?? 0), 0) > 0).map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === c.id ? 'bg-[#DC5B17] text-white' : 'bg-white/5 text-[#999]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Product grid */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-white">{activeLabel}</h2>
            <p className="text-xs text-[#666] mt-0.5">{filtered.length} post{filtered.length === 1 ? '' : 's'}</p>
          </div>

          <div className="relative sm:w-56">
            <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-[#666] focus:outline-none focus:border-[#DC5B17]/50 transition-colors"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#DC5B17]/50 transition-colors"
          >
            <option value="newest" className="bg-[#111]">Newest</option>
            <option value="oldest" className="bg-[#111]">Oldest</option>
            <option value="popular" className="bg-[#111]">Most popular</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center text-[#666] border border-white/10 rounded-2xl">
            {posts.length === 0 ? 'No posts published yet — check back soon.' : 'No posts match your filters.'}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-white/20 transition-colors">
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-white/5">
                  {post.cover_image_url ? (
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-lg bg-[#DC5B17]/20 flex items-center justify-center">
                        <span className="text-[#DC5B17] text-sm font-bold">N</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {post.category && (
                      <span className="px-2 py-1 rounded-md bg-black/70 backdrop-blur text-[10px] font-semibold text-white uppercase tracking-wide">
                        {categoryLabel(post.category) ?? post.category}
                      </span>
                    )}
                    {post.access !== 'Free' && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#DC5B17] text-[10px] font-semibold text-white uppercase tracking-wide">
                        <Sparkle size={10} weight="fill" /> {post.access}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-base font-bold leading-snug mb-2 group-hover:text-[#DC5B17] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {post.subtitle && (
                    <p className="text-sm text-[#666] leading-relaxed mb-4 line-clamp-2">{post.subtitle}</p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-[#555] mt-auto pt-3 border-t border-white/5">
                    <span>{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {post.read_time_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {post.read_time_minutes} min read
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
