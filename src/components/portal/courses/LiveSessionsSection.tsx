'use client';

import { useState, useEffect } from 'react';
import { VideoCamera, Clock } from 'phosphor-react';

type Session = {
  id: string; title: string; description: string | null;
  start_time: string; end_time: string; meet_link: string | null;
};

const JOIN_WINDOW_MS = 10 * 60 * 1000;

function countdown(ms: number): string {
  if (ms <= 0) return 'now';
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function LiveSessionsSection({ sessions }: { sessions: Session[] }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const upcoming = sessions.filter((s) => new Date(s.end_time).getTime() > now);
  if (upcoming.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="font-bold text-base mb-4" style={{ color: 'var(--adm-text)' }}>Live Classes</h2>
      <div className="flex flex-col gap-3">
        {upcoming.map((s) => {
          const start = new Date(s.start_time).getTime();
          const end = new Date(s.end_time).getTime();
          const joinOpensAt = start - JOIN_WINDOW_MS;
          const joinable = now >= joinOpensAt && now <= end;

          return (
            <div key={s.id} className="flex items-center gap-4 p-5 rounded-2xl border" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: joinable ? 'rgba(34,197,94,0.12)' : 'rgba(220,91,23,0.12)', color: joinable ? '#4ade80' : '#DC5B17' }}>
                <VideoCamera size={18} weight="bold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>{s.title}</p>
                <p className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'var(--adm-muted)' }}>
                  <Clock size={11} />
                  {new Date(s.start_time).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  {!joinable && ` · starts in ${countdown(start - now)}`}
                </p>
              </div>
              {joinable && s.meet_link ? (
                <a href={s.meet_link} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors shrink-0">
                  Join Live Class
                </a>
              ) : (
                <span className="px-4 py-2 rounded-xl text-xs font-semibold shrink-0" style={{ color: 'var(--adm-muted)', backgroundColor: 'var(--adm-bg)' }}>
                  Not started
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
