import { createClient } from '@/lib/supabase/server';
import { PortalAnnouncementsClient } from '@/components/portal/announcements/PortalAnnouncementsClient';

export default async function PortalAnnouncementsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('announcements')
    .select('id, title, body, pinned, created_at, cover_image_url, cover_video_url')
    .eq('status', 'published')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  return <PortalAnnouncementsClient announcements={data ?? []} />;
}
