'use client';

import { useState } from 'react';
import { RichTextEditor } from '@/components/dashboard/RichTextEditor';

const CATEGORIES = ['Community', 'Courses', 'Productivity', 'Personal', 'Marketing', 'Industry', 'Finance', 'Tech'];

export function CreatePostClient() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>New Post</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--adm-muted)' }}>Write and publish a new article</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--adm-muted)' }}>TITLE</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            className="w-full bg-transparent text-xl font-semibold outline-none placeholder:opacity-30"
            style={{ color: 'var(--adm-text)' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--adm-muted)' }}>CATEGORY</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              style={{ color: 'var(--adm-text)' }}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--adm-muted)' }}>STATUS</label>
            <div className="flex gap-2">
              {(['draft', 'published'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors border ${
                    status === s
                      ? s === 'published'
                        ? 'bg-green-400/20 text-green-400 border-green-400/20'
                        : 'bg-yellow-400/20 text-yellow-400 border-yellow-400/20'
                      : 'bg-white/5 text-[#555] border-white/5'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <div className="px-5 pt-4 pb-2 border-b" style={{ borderColor: 'var(--adm-border)' }}>
            <label className="text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>CONTENT</label>
          </div>
          <div className="p-2">
            <RichTextEditor value={body} onChange={setBody} />
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button
            className="px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-white/5"
            style={{ color: 'var(--adm-muted)', borderColor: 'var(--adm-border)' }}
          >
            Cancel
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">
            {status === 'published' ? 'Publish Post' : 'Save Draft'}
          </button>
        </div>
      </div>
    </div>
  );
}
