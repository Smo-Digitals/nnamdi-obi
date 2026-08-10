import { TextAa, VideoCamera, FilePdf, ClipboardText, LinkSimple, ListChecks } from 'phosphor-react';
import type { LessonType, Lesson } from './courseTypes';

export const LESSON_META: Record<LessonType, { label: string; icon: typeof TextAa; color: string }> = {
  text:       { label: 'Text Lesson',       icon: TextAa,         color: '#60a5fa' },
  video:      { label: 'Video Lesson',      icon: VideoCamera,    color: '#f472b6' },
  pdf:        { label: 'Book / PDF',        icon: FilePdf,        color: '#fbbf24' },
  assignment: { label: 'Assignment',        icon: ClipboardText,  color: '#a78bfa' },
  link:       { label: 'Link',              icon: LinkSimple,     color: '#34d399' },
  quiz:       { label: 'Quiz',              icon: ListChecks,     color: '#fb7185' },
};

export function lessonSummary(lesson: Lesson) {
  if (lesson.title) return lesson.title;
  switch (lesson.type) {
    case 'text': return lesson.content?.replace(/<[^>]+>/g, '').slice(0, 60) || 'Empty text lesson';
    case 'video': return lesson.video_url || 'Untitled video lesson';
    case 'pdf': return lesson.pdf_url || 'No file attached';
    case 'assignment': return lesson.assignment_instructions?.replace(/<[^>]+>/g, '').slice(0, 60) || 'Empty assignment';
    case 'link': return lesson.link_title || lesson.link_url || 'Untitled link';
    case 'quiz': return `${lesson.questions?.length ?? 0} question${lesson.questions?.length === 1 ? '' : 's'}`;
  }
}
