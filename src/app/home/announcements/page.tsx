import { createClient } from '@/lib/supabase/server';
import { PortalAnnouncementsClient } from '@/components/portal/announcements/PortalAnnouncementsClient';
import { type ViewMode } from '@/components/portal/announcements/announcementUtils';

interface PageProps {
  searchParams: Promise<{ view?: string }>;
}

export default async function PortalAnnouncementsPage({ searchParams }: PageProps) {
  const { view } = await searchParams;
  const initialViewMode: ViewMode = view === 'list' ? 'list' : 'grid';

  const supabase = await createClient();

  const { data } = await supabase
    .from('announcements')
    .select('id, title, body, pinned, created_at, cover_image_url, cover_video_url')
    .eq('status', 'published')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  return <PortalAnnouncementsClient announcements={data ?? []} initialViewMode={initialViewMode} />;
}
