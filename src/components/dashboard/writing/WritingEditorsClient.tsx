'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';
import { EditorSidePanel } from './EditorSidePanel';

type Editor = { id: string; full_name: string; email: string; post_count: number; created_at: string };
type NewEditorResult = { id: string; name: string; email: string; tempPassword: string };

export function WritingEditorsClient() {
  const [editors, setEditors]     = useState<Editor[]>([]);
  const [loading, setLoading]     = useState(true);
  const [adding,  setAdding]      = useState(false);
  const [name,    setName]        = useState('');
  const [email,   setEmail]       = useState('');
  const [saving,  setSaving]      = useState(false);
  const [created, setCreated]     = useState<NewEditorResult | null>(null);
  const [copied,  setCopied]      = useState(false);
  const [errMsg,  setErrMsg]      = useState('');
  const [selected, setSelected]   = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/editors')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setEditors(d); })
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    if (!name.trim() || !email.trim()) return;
    setSaving(true); setErrMsg('');
    const r = await fetch('/api/editors', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: email.trim() }),
    });
    const d = await r.json();
    setSaving(false);
    if (d.error) { setErrMsg(d.error); return; }
    setEditors((prev) => [{ id: d.id, full_name: d.name, email: d.email, post_count: 0, created_at: new Date().toISOString() }, ...prev]);
    setCreated(d); setName(''); setEmail(''); setAdding(false);
  }

  function copyPassword() {
    if (!created) return;
    navigator.clipboard.writeText(created.tempPassword);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  function handleRemove(id: string) {
    fetch(`/api/editors/${id}`, { method: 'DELETE' });
    setEditors((prev) => prev.filter((e) => e.id !== id));
    setSelected(null);
  }

  return (
    <>
      <SectionLayout
        title="Editors"
        subtitle="Manage writers and contributors"
        cta={{ label: 'Add Editor', onClick: () => { setAdding(true); setCreated(null); setErrMsg(''); } }}
        stats={[
          { label: 'Total Editors', value: editors.length },
          { label: 'Total Posts',   value: editors.reduce((s, e) => s + e.post_count, 0) },
        ]}
      >
        {/* Add editor form */}
        {adding && (
          <div className="rounded-2xl border p-5 mb-5 flex flex-col gap-3"
            style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <p className="text-sm font-bold" style={{ color: 'var(--adm-text)' }}>Add New Editor</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--adm-muted)' }}>Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe"
                  className="w-full px-3 py-2 text-sm rounded-xl border outline-none"
                  style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }} />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--adm-muted)' }}>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" type="email"
                  className="w-full px-3 py-2 text-sm rounded-xl border outline-none"
                  style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)', color: 'var(--adm-text)' }} />
              </div>
            </div>
            {errMsg && <p className="text-xs text-red-400">{errMsg}</p>}
            <div className="flex gap-2 pt-1">
              <button onClick={handleAdd} disabled={saving || !name.trim() || !email.trim()}
                className="px-5 py-2 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] disabled:opacity-40 transition-colors">
                {saving ? 'Creating…' : 'Create Editor'}
              </button>
              <button onClick={() => setAdding(false)}
                className="px-4 py-2 rounded-xl border text-sm transition-colors hover:bg-white/5"
                style={{ borderColor: 'var(--adm-border)', color: 'var(--adm-muted)' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Temp password reveal */}
        {created && (
          <div className="rounded-2xl border p-5 mb-5 bg-green-400/5 border-green-400/20">
            <p className="text-sm font-bold text-green-400 mb-1">Editor created — share these credentials once</p>
            <p className="text-xs mb-2" style={{ color: 'var(--adm-muted)' }}>{created.email}</p>
            <div className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ backgroundColor: 'var(--adm-bg)', borderColor: 'var(--adm-border)' }}>
              <code className="flex-1 text-sm font-mono" style={{ color: 'var(--adm-text)' }}>{created.tempPassword}</code>
              <button onClick={copyPassword} className="shrink-0 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                style={{ color: copied ? '#4ade80' : 'var(--adm-muted)' }}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <button onClick={() => setCreated(null)} className="mt-3 text-xs" style={{ color: 'var(--adm-muted)' }}>Dismiss</button>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-2xl border animate-pulse"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }} />
            ))}
          </div>
        ) : editors.length === 0 ? (
          <div className="rounded-2xl border py-16 text-center"
            style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <p className="text-sm" style={{ color: 'var(--adm-muted)' }}>No editors yet. Add one above.</p>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
                  {['Name', 'Email', 'Posts', 'Joined', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {editors.map((e, i) => (
                  <tr key={e.id}
                    onClick={() => setSelected(e.id)}
                    className="cursor-pointer hover:bg-white/[0.02] transition-colors"
                    style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                          style={{ backgroundColor: '#DC5B17' }}>
                          {(e.full_name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--adm-text)' }}>{e.full_name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{e.email}</td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--adm-text)' }}>{e.post_count}</td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>
                      {new Date(e.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-right" style={{ color: 'var(--adm-muted)' }}>View →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionLayout>

      {selected && (
        <EditorSidePanel
          editorId={selected}
          onClose={() => setSelected(null)}
          onRemove={handleRemove}
        />
      )}
    </>
  );
}
