import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Find all scheduled announcements whose time has come
  const { data: due, error: fetchErr } = await supabase
    .from('announcements')
    .select('id, title')
    .eq('status', 'scheduled')
    .lte('scheduled_at', new Date().toISOString());

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  if (!due || due.length === 0) return NextResponse.json({ published: 0 });

  // Publish them all
  const ids = due.map((a) => a.id);
  const { error: updateErr } = await supabase
    .from('announcements')
    .update({ status: 'published', updated_at: new Date().toISOString() })
    .in('id', ids);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  console.log(`[cron] Published ${ids.length} scheduled announcement(s):`, due.map((a) => a.title));
  return NextResponse.json({ published: ids.length, ids });
}
