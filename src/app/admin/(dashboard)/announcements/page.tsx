import { createClient } from '@/lib/supabase/server';
import { AnnouncementsClient } from '@/components/dashboard/announcements/AnnouncementsClient';

export type Announcement = {
  id: string;
  title: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  pinned: boolean;
  created_at: string;
};

export default async function AnnouncementsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('announcements')
    .select('id, title, body, status, pinned, created_at')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  return <AnnouncementsClient announcements={data ?? []} />;
}
