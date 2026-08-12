import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PortalCourseDetailClient } from '@/components/portal/courses/PortalCourseDetailClient';

type Props = { params: Promise<{ id: string }> };

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: course }, { data: assignments }, { data: sessions }, { data: topics }, enrollment, { data: completions }] = await Promise.all([
    supabase.from('courses')
      .select('id, title, description, cover_image_url, intro_video_url, category, difficulty, price, sale_price, instructor, what_youd_get, materials_needed, certification')
      .eq('id', id).single(),
    supabase.from('assignments')
      .select('id, title, description, due_date, rubric, reviews_required')
      .eq('course_id', id)
      .eq('status', 'published')
      .order('created_at'),
    supabase.from('live_sessions')
      .select('id, title, description, start_time, end_time, meet_link')
      .eq('course_id', id)
      .order('start_time'),
    supabase.from('course_topics')
      .select('id, title, description, sort_order, lessons')
      .eq('course_id', id)
      .order('sort_order'),
    user
      ? supabase.from('enrollments').select('id').eq('course_id', id).eq('user_id', user.id).eq('status', 'active').maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase.from('lesson_completions').select('lesson_id').eq('course_id', id).eq('user_id', user.id)
      : Promise.resolve({ data: null }),
  ]);

  if (!course) notFound();

  return (
    <PortalCourseDetailClient
      course={course}
      assignments={assignments ?? []}
      sessions={sessions ?? []}
      topics={topics ?? []}
      isLoggedIn={!!user}
      isEnrolled={!!enrollment.data}
      completedLessonIds={(completions ?? []).map((c) => c.lesson_id)}
    />
  );
}
