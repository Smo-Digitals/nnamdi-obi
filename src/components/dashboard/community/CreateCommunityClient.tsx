'use client';

import { useState } from 'react';

const TYPES = ['Public', 'Private', 'Members Only'];
const CATEGORIES = ['Business', 'Creativity', 'Finance', 'Marketing', 'Tech', 'Lifestyle', 'Education'];

export function CreateCommunityClient() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Public');
  const [category, setCategory] = useState('');

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>Create Community</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--adm-muted)' }}>Set up a new community group for your members</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--adm-muted)' }}>COMMUNITY NAME</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Creator Circle" className="w-full bg-transparent text-lg font-semibold outline-none placeholder:opacity-30" style={{ color: 'var(--adm-text)' }} />
        </div>

        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--adm-muted)' }}>DESCRIPTION</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what this community is about..." rows={3} className="w-full bg-transparent text-sm outline-none resize-none placeholder:opacity-30" style={{ color: 'var(--adm-text)' }} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <label className="block text-xs font-semibold mb-3" style={{ color: 'var(--adm-muted)' }}>TYPE</label>
            <div className="flex flex-col gap-2">
              {TYPES.map((t) => (
                <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors border ${type === t ? 'bg-[#DC5B17]/20 text-[#DC5B17] border-[#DC5B17]/20' : 'bg-white/5 border-white/5 text-[#555] hover:text-white'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--adm-muted)' }}>CATEGORY</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-transparent text-sm outline-none" style={{ color: 'var(--adm-text)' }}>
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button className="px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-white/5" style={{ color: 'var(--adm-muted)', borderColor: 'var(--adm-border)' }}>Cancel</button>
          <button className="px-6 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">Create Community</button>
        </div>
      </div>
    </div>
  );
}
