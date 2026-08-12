import { FilePdf, LinkSimple, ArrowSquareOut } from 'phosphor-react';
import type { Lesson } from '@/components/dashboard/courses/courseTypes';
import { PortalVideoEmbed } from './PortalVideoEmbed';
import { PortalQuizPlayer } from './PortalQuizPlayer';

const proseStyle = {
  '--tw-prose-body':          'var(--adm-muted)',
  '--tw-prose-headings':      'var(--adm-text)',
  '--tw-prose-bold':          'var(--adm-text)',
  '--tw-prose-links':         '#DC5B17',
  '--tw-prose-bullets':       'var(--adm-muted)',
  '--tw-prose-counters':      'var(--adm-muted)',
  '--tw-prose-quotes':        'var(--adm-text)',
  '--tw-prose-quote-borders': '#DC5B17',
  '--tw-prose-hr':            'var(--adm-border)',
  '--tw-prose-code':          'var(--adm-text)',
  '--tw-prose-th-borders':    'var(--adm-border)',
  '--tw-prose-td-borders':    'var(--adm-border)',
} as React.CSSProperties;
const proseClass = 'prose prose-sm max-w-none prose-headings:font-bold prose-a:no-underline hover:prose-a:underline';

export function LessonBody({ lesson }: { lesson: Lesson }) {
  return (
    <div className="mb-8">
      {lesson.type === 'text' && (
        lesson.content
          ? <div className={proseClass} style={proseStyle} dangerouslySetInnerHTML={{ __html: lesson.content }} />
          : <p className="text-sm italic" style={{ color: 'var(--adm-muted)' }}>No content yet.</p>
      )}

      {lesson.type === 'video' && (
        <div className="flex flex-col gap-3">
          {lesson.video_url
            ? <PortalVideoEmbed url={lesson.video_url} />
            : <p className="text-sm italic" style={{ color: 'var(--adm-muted)' }}>No video attached yet.</p>}
          {lesson.caption && <p className="text-sm" style={{ color: 'var(--adm-muted)' }}>{lesson.caption}</p>}
        </div>
      )}

      {lesson.type === 'pdf' && (
        lesson.pdf_url ? (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)', height: 560 }}>
              <iframe src={lesson.pdf_url} className="w-full h-full border-0" />
            </div>
            <a href={lesson.pdf_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold self-start" style={{ color: '#DC5B17' }}>
              <FilePdf size={14} weight="bold" /> Open in new tab
            </a>
          </div>
        ) : (
          <p className="text-sm italic" style={{ color: 'var(--adm-muted)' }}>No file attached yet.</p>
        )
      )}

      {lesson.type === 'assignment' && (
        lesson.assignment_instructions
          ? <div className={proseClass} style={proseStyle} dangerouslySetInnerHTML={{ __html: lesson.assignment_instructions }} />
          : <p className="text-sm italic" style={{ color: 'var(--adm-muted)' }}>No instructions yet.</p>
      )}

      {lesson.type === 'link' && (
        lesson.link_url ? (
          <a href={lesson.link_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-5 rounded-2xl border hover:border-white/15 transition-colors"
            style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(52,211,153,0.12)', color: '#34d399' }}>
              <LinkSimple size={16} weight="bold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--adm-text)' }}>{lesson.link_title || lesson.link_url}</p>
              <p className="text-xs truncate" style={{ color: 'var(--adm-muted)' }}>{lesson.link_url}</p>
            </div>
            <ArrowSquareOut size={16} style={{ color: 'var(--adm-muted)' }} />
          </a>
        ) : (
          <p className="text-sm italic" style={{ color: 'var(--adm-muted)' }}>No link attached yet.</p>
        )
      )}

      {lesson.type === 'quiz' && (
        lesson.questions && lesson.questions.length > 0
          ? <PortalQuizPlayer questions={lesson.questions} />
          : <p className="text-sm italic" style={{ color: 'var(--adm-muted)' }}>This quiz has no questions yet.</p>
      )}
    </div>
  );
}
