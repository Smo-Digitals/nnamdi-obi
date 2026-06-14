import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PortalCourseDetailClient } from '@/components/portal/courses/PortalCourseDetailClient';

type Props = { params: Promise<{ id: string }> };

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: course }, { data: assignments }] = await Promise.all([
    supabase.from('courses').select('id, title, description, cover_image_url').eq('id', id).single(),
    supabase.from('assignments')
      .select('id, title, description, due_date, rubric, reviews_required')
      .eq('course_id', id)
      .eq('status', 'published')
      .order('created_at'),
  ]);

  if (!course) notFound();

  return <PortalCourseDetailClient course={course} assignments={assignments ?? []} />;
}
