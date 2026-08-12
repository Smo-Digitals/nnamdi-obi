'use client';

import { useState } from 'react';
import { CaretDown } from 'phosphor-react';
import { CATEGORIES } from '@/lib/categories';

interface Props {
  counts: Record<string, number>;
  totalCount: number;
  active: string;
  onSelect: (id: string) => void;
}

export function BlogCategorySidebar({ counts, totalCount, active, onSelect }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const visibleCategories = CATEGORIES
    .map((c) => ({
      ...c,
      count: (counts[c.id] ?? 0) + c.children.reduce((s, ch) => s + (counts[ch.id] ?? 0), 0),
      children: c.children.filter((ch) => (counts[ch.id] ?? 0) > 0),
    }))
    .filter((c) => c.count > 0);

  return (
    <nav className="flex flex-col gap-0.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#555] mb-2 px-3">Categories</p>

      <button
        onClick={() => onSelect('all')}
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          active === 'all' ? 'bg-[#DC5B17]/15 text-[#DC5B17]' : 'text-[#999] hover:bg-white/5 hover:text-white'
        }`}
      >
        All Posts
        <span className="text-xs text-[#555]">{totalCount}</span>
      </button>

      {visibleCategories.map((c) => {
        const isOpen = expanded.has(c.id);
        const hasChildren = c.children.length > 0;
        const isActiveParent = active === c.id;

        return (
          <div key={c.id}>
            <div
              className={`flex items-center gap-1 pr-1.5 rounded-lg transition-colors ${
                isActiveParent ? 'bg-[#DC5B17]/15' : 'hover:bg-white/5'
              }`}
            >
              <button
                onClick={() => onSelect(c.id)}
                className={`flex-1 flex items-center justify-between px-3 py-2 text-sm font-medium text-left ${
                  isActiveParent ? 'text-[#DC5B17]' : 'text-[#999] hover:text-white'
                }`}
              >
                {c.label}
                <span className="text-xs text-[#555]">{c.count}</span>
              </button>
              {hasChildren && (
                <button
                  onClick={() => toggleExpanded(c.id)}
                  className="p-1.5 text-[#555] hover:text-white transition-colors"
                  aria-label={isOpen ? 'Collapse' : 'Expand'}
                >
                  <CaretDown size={11} weight="bold" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </button>
              )}
            </div>

            {hasChildren && isOpen && (
              <div className="flex flex-col gap-0.5 mt-0.5 mb-1">
                {c.children.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => onSelect(ch.id)}
                    className={`flex items-center justify-between pl-7 pr-3 py-1.5 rounded-lg text-[13px] transition-colors ${
                      active === ch.id ? 'bg-[#DC5B17]/15 text-[#DC5B17] font-medium' : 'text-[#777] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {ch.label}
                    <span className="text-xs text-[#555]">{counts[ch.id] ?? 0}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
