import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getValidAccessTokenForAdmin, deleteMeetEvent } from '@/lib/google/calendar';

type Params = Promise<{ id: string }>;

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data: session } = await admin.from('live_sessions').select('calendar_event_id').eq('id', id).single();

  if (session?.calendar_event_id) {
    try {
      const accessToken = await getValidAccessTokenForAdmin(user.id);
      await deleteMeetEvent(accessToken, session.calendar_event_id);
    } catch {
      // Calendar event may already be gone or token unavailable — still remove our record.
    }
  }

  const { error } = await admin.from('live_sessions').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
