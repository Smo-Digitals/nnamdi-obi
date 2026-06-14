import { createClient } from '@/lib/supabase/server';
import { PortalCoursesClient } from '@/components/portal/courses/PortalCoursesClient';

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('courses')
    .select('id, title, description, cover_image_url, price')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  return <PortalCoursesClient courses={data ?? []} />;
}
