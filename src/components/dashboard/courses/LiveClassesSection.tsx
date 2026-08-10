'use client';

import { useState, useEffect } from 'react';
import { VideoCamera, Plus, Trash, LinkSimple, GoogleLogo, CheckCircle } from 'phosphor-react';

type Session = {
  id: string; title: string; description: string | null;
  start_time: string; end_time: string; meet_link: string | null;
};

export function LiveClassesSection({ courseId }: { courseId: string }) {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [email,      setEmail]     = useState<string | null>(null);
  const [sessions,   setSessions]  = useState<Session[]>([]);
  const [loading,    setLoading]   = useState(true);
  const [creating,   setCreating]  = useState(false);
  const [error,      setError]     = useState<string | null>(null);

  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [startTime,   setStartTime]   = useState('');
  const [endTime,      setEndTime]     = useState('');

  function loadSessions() {
    fetch(`/api/live-sessions?course_id=${courseId}`)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setSessions(d); });
  }

  useEffect(() => {
    fetch('/api/admin/google/status').then((r) => r.json()).then((status) => {
      setConnected(status.connected);
      setEmail(status.email);
    }).finally(() => setLoading(false));
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  function connectGoogle() {
    window.location.href = `/api/admin/google/connect?returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`;
  }

  async function createSession() {
    if (!title.trim() || !startTime || !endTime) { setError('Title, start time and end time are required.'); return; }
    setCreating(true); setError(null);
    const res = await fetch('/api/live-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        course_id: courseId, title: title.trim(), description: description.trim() || null,
        start_time: new Date(startTime).toISOString(), end_time: new Date(endTime).toISOString(),
      }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) { setError(data.error ?? 'Could not schedule the session.'); return; }
    setSessions((prev) => [...prev, data].sort((a, b) => a.start_time.localeCompare(b.start_time)));
    setTitle(''); setDescription(''); setStartTime(''); setEndTime('');
  }

  async function removeSession(id: string) {
    if (!confirm('Cancel this live class? This removes the Google Calendar event too.')) return;
    setSessions((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/live-sessions/${id}`, { method: 'DELETE' });
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-[#DC5B17] transition-colors';
  const style = { color: 'var(--adm-text)', borderColor: 'var(--adm-border)' };

  if (loading) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
      <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--adm-muted)' }}>Live Classes</p>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: connected ? 'rgba(34,197,94,0.12)' : 'var(--adm-bg)', color: connected ? '#4ade80' : 'var(--adm-muted)' }}>
          {connected ? <CheckCircle size={18} weight="bold" /> : <GoogleLogo size={18} weight="bold" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: 'var(--adm-text)' }}>Google Meet</p>
          <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>
            {connected ? `Connected as ${email}` : 'Connect your Google account to schedule live classes with a Meet link'}
          </p>
        </div>
        {!connected && (
          <button onClick={connectGoogle}
            className="px-4 py-2 rounded-xl bg-[#DC5B17] text-white text-xs font-semibold hover:bg-[#c44f13] transition-colors shrink-0">
            Connect Google
          </button>
        )}
      </div>

      {connected && (
        <div className="flex flex-col gap-3 pt-1 border-t" style={{ borderColor: 'var(--adm-border)' }}>
          {error && <p className="text-xs text-red-400 pt-3">{error}</p>}
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Session title…" className={`${inputCls} mt-3`} style={style} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Description (optional)…"
            className={`${inputCls} resize-none`} style={style} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium mb-1.5 block" style={{ color: 'var(--adm-muted)' }}>Start</label>
              <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputCls} style={{ ...style, colorScheme: 'dark' }} />
            </div>
            <div>
              <label className="text-[11px] font-medium mb-1.5 block" style={{ color: 'var(--adm-muted)' }}>End</label>
              <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputCls} style={{ ...style, colorScheme: 'dark' }} />
            </div>
          </div>
          <button onClick={createSession} disabled={creating}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-50 self-start">
            <Plus size={14} weight="bold" /> {creating ? 'Scheduling…' : 'Schedule Live Class'}
          </button>
        </div>
      )}

      {sessions.length > 0 && (
        <div className="flex flex-col gap-2 pt-1 border-t" style={{ borderColor: 'var(--adm-border)' }}>
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border p-3 mt-3" style={{ borderColor: 'var(--adm-border)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(220,91,23,0.12)', color: '#DC5B17' }}>
                <VideoCamera size={14} weight="bold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--adm-text)' }}>{s.title}</p>
                <p className="text-[11px]" style={{ color: 'var(--adm-muted)' }}>
                  {new Date(s.start_time).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {s.meet_link && (
                <a href={s.meet_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-semibold shrink-0" style={{ color: '#DC5B17' }}>
                  <LinkSimple size={12} /> Meet link
                </a>
              )}
              <button onClick={() => removeSession(s.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors shrink-0" style={{ color: 'var(--adm-muted)' }}>
                <Trash size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
