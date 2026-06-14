import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, body, status, pinned, scheduled_at, cover_image_url, cover_video_url } = await req.json();

  const { data, error } = await supabase
    .from('announcements')
    .insert({ title, body, status, pinned, scheduled_at: scheduled_at ?? null, author_id: user.id, cover_image_url: cover_image_url ?? null, cover_video_url: cover_video_url ?? null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
