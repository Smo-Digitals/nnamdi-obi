import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PortalAnnouncementDetail } from '@/components/portal/announcements/PortalAnnouncementDetail';

type Props = { params: Promise<{ id: string }> };

export default async function AnnouncementDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('announcements')
    .select('id, title, body, pinned, created_at, cover_image_url, cover_video_url')
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (!data) notFound();

  return <PortalAnnouncementDetail announcement={data} />;
}
