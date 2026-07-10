'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlass } from 'phosphor-react';

type Post = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  cover_image_url: string | null;
  category: string | null;
  created_at: string;
};

type CategoryOption = { id: string; label: string };

export function BlogIndexClient({ posts, categories }: { posts: Post[]; categories: CategoryOption[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
      const matchesQuery =
        !q || post.title.toLowerCase().includes(q) || (post.subtitle ?? '').toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [posts, activeCategory, query]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all' ? 'bg-[#DC5B17] text-white' : 'bg-white/5 text-[#999] hover:bg-white/10'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === c.id ? 'bg-[#DC5B17] text-white' : 'bg-white/5 text-[#999] hover:bg-white/10'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative sm:ml-auto sm:w-64">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-[#666] focus:outline-none focus:border-[#DC5B17]/50 transition-colors"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center text-[#666]">
          {posts.length === 0 ? 'No posts published yet — check back soon.' : 'No posts match your filters.'}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 bg-white/5">
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
              </div>

              {post.category && (
                <span className="text-[11px] font-semibold text-[#DC5B17] uppercase tracking-wide mb-2">
                  {categories.find((c) => c.id === post.category)?.label ?? post.category}
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
    </>
  );
}
