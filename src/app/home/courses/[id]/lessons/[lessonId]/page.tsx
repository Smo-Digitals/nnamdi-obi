import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PortalLessonClient } from '@/components/portal/courses/PortalLessonClient';
import type { Lesson } from '@/components/dashboard/courses/courseTypes';

type TopicRow = { id: string; title: string; description: string | null; sort_order: number; lessons: Lesson[] };

type Props = { params: Promise<{ id: string; lessonId: string }> };

export default async function LessonPage({ params }: Props) {
  const { id, lessonId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: course }, { data: enrollment }, { data: topics }, { data: completion }] = await Promise.all([
    supabase.from('courses').select('id, title').eq('id', id).single(),
    supabase.from('enrollments').select('id').eq('course_id', id).eq('user_id', user.id).eq('status', 'active').maybeSingle(),
    supabase.from('course_topics').select('id, title, description, sort_order, lessons').eq('course_id', id).order('sort_order'),
    supabase.from('lesson_completions').select('id').eq('lesson_id', lessonId).eq('user_id', user.id).maybeSingle(),
  ]);

  if (!course) notFound();
  if (!enrollment) redirect(`/home/courses/${id}`);

  const orderedTopics = (topics ?? []) as TopicRow[];
  const flat = orderedTopics.flatMap((t) => t.lessons.map((l) => ({ topicTitle: t.title, lesson: l })));
  const index = flat.findIndex((f) => f.lesson.id === lessonId);
  if (index === -1) notFound();

  const { topicTitle, lesson } = flat[index];
  const prevId = index > 0 ? flat[index - 1].lesson.id : null;
  const nextId = index < flat.length - 1 ? flat[index + 1].lesson.id : null;

  return (
    <PortalLessonClient
      courseId={id}
      courseTitle={course.title}
      topicTitle={topicTitle}
      lesson={lesson}
      prevId={prevId}
      nextId={nextId}
      initiallyCompleted={!!completion}
    />
  );
}
