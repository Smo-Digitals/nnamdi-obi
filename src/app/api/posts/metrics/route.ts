import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const admin = createAdminClient();

  const { data: posts, error } = await admin
    .from('posts')
    .select('id, title, status, views, created_at')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const all = posts ?? [];
  const published = all.filter((p) => p.status === 'published');
  const drafts    = all.filter((p) => p.status === 'draft');
  const totalViews = all.reduce((s, p) => s + (p.views ?? 0), 0);
  const avgViews   = published.length > 0
    ? Math.round(totalViews / published.length) : 0;

  // Top 5 posts by views
  const topPosts = [...all]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 5)
    .map((p) => ({ id: p.id, title: p.title, views: p.views ?? 0 }));

  // Posts published per month (last 6 months)
  const now  = new Date();
  const monthlyData: { month: string; count: number; views: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
    const inMonth = published.filter((p) => {
      const c = new Date(p.created_at);
      return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth();
    });
    monthlyData.push({
      month: label,
      count: inMonth.length,
      views: inMonth.reduce((s, p) => s + (p.views ?? 0), 0),
    });
  }

  return NextResponse.json({
    totalViews,
    totalPosts:      all.length,
    publishedPosts:  published.length,
    draftPosts:      drafts.length,
    avgViews,
    topPosts,
    monthlyData,
  });
}
