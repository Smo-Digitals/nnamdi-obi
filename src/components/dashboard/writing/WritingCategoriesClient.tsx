'use client';

import { useState } from 'react';

type Category = {
  id: string; name: string; slug: string;
  description: string; posts: number; parentId: string | null;
};

const MOCK: Category[] = [
  { id: '1', name: 'Community',    slug: 'community',    description: 'Community discussions and updates', posts: 0, parentId: null },
  { id: '2', name: 'Courses',      slug: 'courses',      description: 'Course-related content',           posts: 0, parentId: null },
  { id: '3', name: 'Productivity', slug: 'productivity', description: 'Tips for doing more with less',    posts: 0, parentId: null },
  { id: '4', name: 'Personal',     slug: 'personal',     description: 'Personal stories and reflections', posts: 0, parentId: null },
  { id: '5', name: 'Marketing',    slug: 'marketing',    description: 'Marketing strategies and ideas',   posts: 0, parentId: null },
  { id: '6', name: 'Industry',     slug: 'industry',     description: 'Industry news and trends',         posts: 0, parentId: null },
  { id: '7', name: 'Finance',      slug: 'finance',      description: 'Finance and money management',     posts: 0, parentId: null },
];

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/** Flatten categories into ordered rows: parent first, then its children indented */
function flattenCategories(cats: Category[]): { cat: Category; depth: number }[] {
  const topLevel = cats.filter((c) => c.parentId === null);
  const result: { cat: Category; depth: number }[] = [];
  for (const parent of topLevel) {
    result.push({ cat: parent, depth: 0 });
    for (const child of cats.filter((c) => c.parentId === parent.id)) {
      result.push({ cat: child, depth: 1 });
    }
  }
  return result;
}

export function WritingCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>(MOCK);
  const [editing,    setEditing]    = useState<Category | null>(null);
  const [hoverId,    setHoverId]    = useState<string | null>(null);
  const [selected,   setSelected]   = useState<Set<string>>(new Set());

  // Form state
  const [name,     setName]     = useState('');
  const [slug,     setSlug]     = useState('');
  const [desc,     setDesc]     = useState('');
  const [parentId, setParentId] = useState<string | null>(null);

  function startEdit(c: Category) {
    setEditing(c); setName(c.name); setSlug(c.slug); setDesc(c.description); setParentId(c.parentId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditing(null); setName(''); setSlug(''); setDesc(''); setParentId(null);
  }

  function handleName(v: string) {
    setName(v);
    if (!editing) setSlug(toSlug(v));
  }

  function save() {
    if (!name.trim()) return;
    if (editing) {
      setCategories((cs) => cs.map((c) =>
        c.id === editing.id ? { ...c, name, slug, description: desc, parentId } : c));
    } else {
      setCategories((cs) => [...cs, {
        id: Date.now().toString(), name, slug, description: desc, posts: 0, parentId,
      }]);
    }
    resetForm();
  }

  function remove(id: string) {
    if (!confirm('Delete this category?')) return;
    setCategories((cs) => cs.filter((c) => c.id !== id && c.parentId !== id));
    setSelected((s) => { const n = new Set(s); n.delete(id); return n; });
  }

  function bulkDelete() {
    if (!selected.size || !confirm(`Delete ${selected.size} categories?`)) return;
    setCategories((cs) => cs.filter((c) => !selected.has(c.id) && !selected.has(c.parentId ?? '')));
    setSelected(new Set());
  }

  function toggleSelect(id: string) {
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function toggleAll(rows: { cat: Category }[]) {
    const ids = rows.map((r) => r.cat.id);
    const allSelected = ids.every((id) => selected.has(id));
    setSelected(allSelected ? new Set() : new Set(ids));
  }

  const rows = flattenCategories(categories);
  const topLevel = categories.filter((c) => c.parentId === null);

  return (
    <div className="p-8 flex gap-8 items-start">

      {/* ── Left: form ── */}
      <div className="w-64 shrink-0 sticky top-8 flex flex-col gap-5">
        <div>
          <h2 className="text-base font-bold mb-4" style={{ color: 'var(--adm-text)' }}>
            {editing ? 'Edit Category' : 'Add New Category'}
          </h2>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--adm-text)' }}>Name</label>
              <input value={name} onChange={(e) => handleName(e.target.value)} autoFocus
                placeholder="Category name"
                className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }} />
              <p className="text-[11px] mt-1" style={{ color: 'var(--adm-muted)' }}>The name shown on your site.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--adm-text)' }}>Slug</label>
              <input value={slug} onChange={(e) => setSlug(toSlug(e.target.value))}
                placeholder="category-slug"
                className="w-full px-3 py-2 text-sm rounded-lg border outline-none font-mono"
                style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-muted)' }} />
              <p className="text-[11px] mt-1" style={{ color: 'var(--adm-muted)' }}>URL-friendly version of the name.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--adm-text)' }}>Parent Category</label>
              <select value={parentId ?? ''}
                onChange={(e) => setParentId(e.target.value || null)}
                className="w-full px-3 py-2 text-sm rounded-lg border outline-none cursor-pointer"
                style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }}>
                <option value="">None</option>
                {topLevel.filter((c) => !editing || c.id !== editing.id).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <p className="text-[11px] mt-1" style={{ color: 'var(--adm-muted)' }}>Leave empty for a top-level category.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--adm-text)' }}>Description</label>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
                placeholder="Optional description"
                rows={3} className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none"
                style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }} />
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={save} disabled={!name.trim()}
                className="flex-1 py-2 rounded-lg text-sm font-semibold bg-[#DC5B17] text-white hover:bg-[#c44f13] transition-colors disabled:opacity-40">
                {editing ? 'Update' : 'Add New Category'}
              </button>
              {editing && (
                <button onClick={resetForm}
                  className="px-3 py-2 rounded-lg text-sm border transition-colors hover:bg-white/5"
                  style={{ color: 'var(--adm-muted)', borderColor: 'var(--adm-border)' }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* mini stats */}
        <div className="border-t pt-4 flex gap-4" style={{ borderColor: 'var(--adm-border)' }}>
          <div>
            <p className="text-lg font-bold" style={{ color: 'var(--adm-text)' }}>{categories.length}</p>
            <p className="text-[11px]" style={{ color: 'var(--adm-muted)' }}>Categories</p>
          </div>
          <div>
            <p className="text-lg font-bold" style={{ color: 'var(--adm-text)' }}>{categories.reduce((s, c) => s + c.posts, 0)}</p>
            <p className="text-[11px]" style={{ color: 'var(--adm-muted)' }}>Total posts</p>
          </div>
        </div>
      </div>

      {/* ── Right: table ── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold" style={{ color: 'var(--adm-text)' }}>Writing Categories</h1>
          {selected.size > 0 && (
            <button onClick={bulkDelete}
              className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors">
              Delete {selected.size} selected
            </button>
          )}
        </div>

        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
                <th className="px-4 py-3 w-8">
                  <input type="checkbox"
                    checked={rows.length > 0 && rows.every((r) => selected.has(r.cat.id))}
                    onChange={() => toggleAll(rows)}
                    className="accent-[#DC5B17] cursor-pointer" />
                </th>
                {['Name', 'Description', 'Slug', 'Count'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ cat, depth }, i) => (
                <tr key={cat.id}
                  onMouseEnter={() => setHoverId(cat.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className="group transition-colors"
                  style={{
                    backgroundColor: selected.has(cat.id) ? 'rgba(220,91,23,0.06)' : 'var(--adm-card)',
                    borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined,
                  }}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(cat.id)} onChange={() => toggleSelect(cat.id)}
                      className="accent-[#DC5B17] cursor-pointer" />
                  </td>
                  <td className="px-4 py-3">
                    <div style={{ paddingLeft: depth * 16 }}>
                      {depth > 0 && (
                        <span className="mr-1 text-xs" style={{ color: 'var(--adm-border)' }}>—</span>
                      )}
                      <span className="text-sm font-medium" style={{ color: 'var(--adm-text)' }}>{cat.name}</span>
                      {hoverId === cat.id && (
                        <span className="ml-2 text-[11px]">
                          <button onClick={() => startEdit(cat)}
                            className="hover:underline mr-1.5" style={{ color: '#DC5B17' }}>Edit</button>
                          <span style={{ color: 'var(--adm-border)' }}>|</span>
                          <button onClick={() => remove(cat.id)}
                            className="hover:underline ml-1.5" style={{ color: 'var(--adm-muted)' }}>Delete</button>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs max-w-xs" style={{ color: 'var(--adm-muted)' }}>
                    <span className="line-clamp-1">{cat.description || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--adm-muted)' }}>{cat.slug}</td>
                  <td className="px-4 py-3 text-sm text-center" style={{ color: 'var(--adm-text)' }}>{cat.posts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
