'use client';

import { useState } from 'react';
import { PencilSimple, Trash, Tag } from 'phosphor-react';

type Category = { id: string; name: string; slug: string; description: string; posts: number };

const MOCK: Category[] = [
  { id: '1', name: 'Community',   slug: 'community',   description: 'Community discussions and updates', posts: 8 },
  { id: '2', name: 'Courses',     slug: 'courses',     description: 'Course-related content',           posts: 5 },
  { id: '3', name: 'Productivity',slug: 'productivity',description: 'Tips for doing more with less',    posts: 12 },
  { id: '4', name: 'Personal',    slug: 'personal',    description: 'Personal stories and reflections', posts: 6 },
  { id: '5', name: 'Marketing',   slug: 'marketing',   description: 'Marketing strategies and ideas',   posts: 9 },
  { id: '6', name: 'Industry',    slug: 'industry',    description: 'Industry news and trends',         posts: 4 },
  { id: '7', name: 'Finance',     slug: 'finance',     description: 'Finance and money management',     posts: 7 },
];

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function WritingCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>(MOCK);
  const [editing,    setEditing]    = useState<Category | null>(null);
  const [name,       setName]       = useState('');
  const [slug,       setSlug]       = useState('');
  const [desc,       setDesc]       = useState('');

  function startEdit(c: Category) {
    setEditing(c); setName(c.name); setSlug(c.slug); setDesc(c.description);
  }

  function resetForm() {
    setEditing(null); setName(''); setSlug(''); setDesc('');
  }

  function handleName(v: string) {
    setName(v);
    if (!editing) setSlug(toSlug(v));
  }

  function save() {
    if (!name.trim()) return;
    if (editing) {
      setCategories((cs) => cs.map((c) => c.id === editing.id ? { ...c, name, slug, description: desc } : c));
    } else {
      setCategories((cs) => [...cs, { id: Date.now().toString(), name, slug, description: desc, posts: 0 }]);
    }
    resetForm();
  }

  function remove(id: string) {
    if (!confirm('Delete this category?')) return;
    setCategories((cs) => cs.filter((c) => c.id !== id));
  }

  return (
    <div className="p-8 flex gap-6 min-h-screen items-start">

      {/* Left — form */}
      <div className="w-72 shrink-0 sticky top-8">
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>

          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--adm-border)' }}>
            <h2 className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>
              {editing ? 'Edit Category' : 'Add Category'}
            </h2>
            {editing && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--adm-muted)' }}>Editing "{editing.name}"</p>
            )}
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--adm-muted)' }}>
                Name
              </label>
              <input value={name} onChange={(e) => handleName(e.target.value)}
                placeholder="e.g. Building in Public"
                className="w-full px-3 py-2 text-sm rounded-xl border outline-none"
                style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }} />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--adm-muted)' }}>
                Slug
              </label>
              <input value={slug} onChange={(e) => setSlug(toSlug(e.target.value))}
                placeholder="building-in-public"
                className="w-full px-3 py-2 text-sm rounded-xl border outline-none font-mono"
                style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-muted)' }} />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--adm-muted)' }}>
                Description
              </label>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
                placeholder="What is this category about?"
                rows={3} className="w-full px-3 py-2 text-sm rounded-xl border outline-none resize-none"
                style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }} />
            </div>

            <div className="flex gap-2">
              <button onClick={save} disabled={!name.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-[#DC5B17] text-white hover:bg-[#c44f13] transition-colors disabled:opacity-40">
                {editing ? 'Save changes' : 'Add category'}
              </button>
              {editing && (
                <button onClick={resetForm}
                  className="px-3 py-2.5 rounded-xl text-sm border transition-colors hover:bg-white/5"
                  style={{ color: 'var(--adm-muted)', borderColor: 'var(--adm-border)' }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { label: 'Categories', value: categories.length },
            { label: 'Total Posts', value: categories.reduce((s, c) => s + c.posts, 0) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl border p-3 text-center" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
              <p className="text-xl font-bold" style={{ color: 'var(--adm-text)' }}>{value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--adm-muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — list */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>Writing Categories</h1>
          <p className="text-sm" style={{ color: 'var(--adm-muted)' }}>Organise your posts into categories</p>
        </div>

        <div className="flex flex-col gap-3">
          {categories.length === 0 ? (
            <div className="rounded-2xl border p-12 flex flex-col items-center text-center"
              style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
              <Tag size={28} style={{ color: 'var(--adm-muted)' }} className="mb-3" />
              <p className="text-sm font-medium" style={{ color: 'var(--adm-muted)' }}>No categories yet</p>
              <p className="text-xs mt-1" style={{ color: 'var(--adm-muted)' }}>Add your first category using the form on the left</p>
            </div>
          ) : (
            categories.map((c) => (
              <div key={c.id} className="rounded-2xl border px-5 py-4 flex items-center gap-4"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--adm-pill)' }}>
                  <Tag size={16} className="text-[#DC5B17]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>{c.name}</p>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
                      style={{ backgroundColor: 'var(--adm-pill)', color: 'var(--adm-muted)' }}>
                      {c.slug}
                    </span>
                  </div>
                  {c.description && (
                    <p className="text-xs truncate" style={{ color: 'var(--adm-muted)' }}>{c.description}</p>
                  )}
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <span className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>
                    {c.posts} post{c.posts !== 1 ? 's' : ''}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(c)}
                      className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                      style={{ color: 'var(--adm-muted)' }}>
                      <PencilSimple size={14} />
                    </button>
                    <button onClick={() => remove(c.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      style={{ color: 'var(--adm-muted)' }}>
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
