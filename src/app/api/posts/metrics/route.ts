import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const admin = createAdminClient();

  const { data: posts, error } = await admin
    .from('posts')
    .select('id, title, cover_image_url, status, views, likes, comment_count, read_time_minutes, created_at')
    .order('views', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const all = posts ?? [];

  const totalViews    = all.reduce((s, p) => s + (p.views ?? 0), 0);
  const totalLikes    = all.reduce((s, p) => s + (p.likes ?? 0), 0);
  const totalComments = all.reduce((s, p) => s + (p.comment_count ?? 0), 0);

  const withTime = all.filter((p) => (p.read_time_minutes ?? 0) > 0);
  const avgReadSeconds = withTime.length > 0
    ? Math.round(withTime.reduce((s, p) => s + (p.read_time_minutes ?? 0) * 60, 0) / withTime.length)
    : 0;

  return NextResponse.json({
    totalViews,
    totalLikes,
    totalComments,
    avgReadSeconds,
    totalPosts: all.length,
    posts: all,
  });
}
