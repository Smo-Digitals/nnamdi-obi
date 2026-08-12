import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { PortalCoursesClient } from '@/components/portal/courses/PortalCoursesClient';
import type { CourseCardData } from '@/components/portal/courses/courseCardTypes';

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: courses }, { data: topics }, { data: enrollRows }, myEnrollments, myCompletions] = await Promise.all([
    supabase.from('courses')
      .select('id, title, description, cover_image_url, price, sale_price, category, difficulty, certification')
      .eq('status', 'published')
      .order('created_at', { ascending: false }),
    supabase.from('course_topics').select('course_id, lessons'),
    createAdminClient().from('enrollments').select('course_id').eq('status', 'active'),
    user
      ? supabase.from('enrollments').select('course_id').eq('user_id', user.id).eq('status', 'active')
      : Promise.resolve({ data: [] as { course_id: string }[] }),
    user
      ? supabase.from('lesson_completions').select('course_id, lesson_id').eq('user_id', user.id)
      : Promise.resolve({ data: [] as { course_id: string; lesson_id: string }[] }),
  ]);

  const lessonCounts = new Map<string, number>();
  for (const t of topics ?? []) {
    const n = Array.isArray(t.lessons) ? t.lessons.length : 0;
    lessonCounts.set(t.course_id, (lessonCounts.get(t.course_id) ?? 0) + n);
  }

  const enrolledCounts = new Map<string, number>();
  for (const e of enrollRows ?? []) {
    enrolledCounts.set(e.course_id, (enrolledCounts.get(e.course_id) ?? 0) + 1);
  }

  const myEnrolledIds = new Set((myEnrollments.data ?? []).map((e) => e.course_id));

  const completedCounts = new Map<string, number>();
  for (const c of myCompletions.data ?? []) {
    completedCounts.set(c.course_id, (completedCounts.get(c.course_id) ?? 0) + 1);
  }

  const cards: CourseCardData[] = (courses ?? []).map((c) => {
    const lessonCount = lessonCounts.get(c.id) ?? 0;
    const isEnrolled = myEnrolledIds.has(c.id);
    const completed = completedCounts.get(c.id) ?? 0;
    return {
      ...c,
      lessonCount,
      enrolledCount: enrolledCounts.get(c.id) ?? 0,
      isEnrolled,
      progressPct: isEnrolled && lessonCount > 0 ? Math.round((completed / lessonCount) * 100) : 0,
      isLoggedIn: !!user,
    };
  });

  return <PortalCoursesClient courses={cards} />;
}
